//
//  ReceiveViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/9/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Loaf
import Alamofire
import Firebase
import FirebaseAuth

class ReceiveViewController: UIViewController {
    
    @IBOutlet weak var UserAddress: UITextField!
    @IBOutlet weak var QRCode: UIImageView!
    @IBOutlet weak var copyButton: UIButton!
    
    private let userId = Auth.auth().currentUser?.uid
    private let apiKey = "b4tXEhQaUmYyAUBMf0SMSoFzcVkXZ64JnCprKWc8iZyv8KiX8kNuQsoB"
    
//    override var preferredStatusBarStyle: UIStatusBarStyle {
//        return .lightContent
//    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
//        setNeedsStatusBarAppearanceUpdate()
        
        // Some design with the address field and the copy button
        copyButton.round(corners: [.topRight, .bottomRight], radius: 5)
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 15, height: self.UserAddress.frame.height))
        UserAddress.leftView = paddingView
        UserAddress.rightView = paddingView
        UserAddress.leftViewMode = UITextField.ViewMode.always
        
        // Load user's balance
        getUserAddress()
    }
    
    func getUserAddress() {
        var headers = HTTPHeaders.default
        headers["x-api-key"] = apiKey
        headers["user-id"] = userId
        
        AF.request("http://127.0.0.1:8364/wallet/createAddress", headers: headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Set user balance label
                    let address = dict["address"] as! String
                    self.UserAddress.text = address
                    self.QRCode.image = self.generateQRCode(from: "bitcoin:\(address)")
                } else {
                    let alert = UIAlertController(title: "Oops", message: "Something went wrong. Try again.", preferredStyle: .alert)
                    self.present(alert, animated: true)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                }
            case .failure(let error):
                print(error.localizedDescription)
            }
        }
    }
    
    func generateQRCode(from string: String) -> UIImage? {
        let data = string.data(using: String.Encoding.ascii)
        
        guard let filter = CIFilter(name: "CIQRCodeGenerator") else { return nil }
        filter.setValue(data, forKey: "inputMessage")
        
        // Scale the image
        let transform = CGAffineTransform(scaleX: 10, y: 10)
        guard let scaledQrImage = filter.outputImage?.transformed(by: transform) else { return nil }
        
        // Invert the colors
        guard let colorInvertFilter = CIFilter(name: "CIColorInvert") else { return nil }
        colorInvertFilter.setValue(scaledQrImage, forKey: "inputImage")
        guard let outputInvertedImage = colorInvertFilter.outputImage else { return nil }
        
        // Replace the black with transparency
        guard let maskToAlphaFilter = CIFilter(name: "CIMaskToAlpha") else { return nil }
        maskToAlphaFilter.setValue(outputInvertedImage, forKey: "inputImage")
        guard let outputCIImage = maskToAlphaFilter.outputImage else { return nil }
        
        return UIImage(ciImage: outputCIImage)
    }
    
    @IBAction func copyClicked(_ sender: Any) {
        Loaf("Copied to the clipboard", state: .success, sender: self).show()
        UIPasteboard.general.string = UserAddress.text
    }

}
