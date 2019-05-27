//
//  SendViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/25/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import Firebase
import FirebaseAuth

class SendViewController: UIViewController {
    
    @IBOutlet weak var toLabel: UILabel!
    @IBOutlet weak var btcAddress: UITextField!
    @IBOutlet weak var scanQrCode: UIButton!
    
    @IBOutlet weak var amountLabel: UILabel!
    @IBOutlet weak var btcAmount: UITextField!
    
    @IBOutlet weak var amountButton1: UIButton!
    @IBOutlet weak var amountButton2: UIButton!
    @IBOutlet weak var amountButton3: UIButton!
    @IBOutlet weak var amountButton4: UIButton!
    @IBOutlet weak var amountButton5: UIButton!
    
    @IBOutlet weak var memoLabel: UILabel!
    @IBOutlet weak var txComment: UITextField!

    @IBOutlet weak var sendButton: UIButton!
    
    private let userId = Auth.auth().currentUser?.uid
    private let apiKey = "b4tXEhQaUmYyAUBMf0SMSoFzcVkXZ64JnCprKWc8iZyv8KiX8kNuQsoB"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.toLabel.layer.zPosition = 1
        self.toLabel.round(corners: [.topLeft, .bottomLeft], radius: 5)
        self.scanQrCode.round(corners: [.topRight, .bottomRight], radius: 5)
        
        self.amountLabel.layer.zPosition = 1
        self.amountLabel.round(corners: [.topLeft, .bottomLeft], radius: 5)
        self.btcAmount.keyboardType = UIKeyboardType.decimalPad
        
        self.amountButton1.round(corners: [.allCorners], radius: 5)
        self.amountButton2.round(corners: [.allCorners], radius: 5)
        self.amountButton3.round(corners: [.allCorners], radius: 5)
        self.amountButton4.round(corners: [.allCorners], radius: 5)
        self.amountButton5.round(corners: [.allCorners], radius: 5)
        
        self.memoLabel.round(corners: [.allCorners], radius: 5)
        self.sendButton.round(corners: [.allCorners], radius: 5)
    }
    
    @IBAction func amountButton1Clicked(_ sender: Any) {
        self.btcAmount.text = "0.0001"
    }

    @IBAction func amountButton2Clicked(_ sender: Any) {
        self.btcAmount.text = "0.001"
    }
    
    @IBAction func amountButton3Clicked(_ sender: Any) {
        self.btcAmount.text = "0.01"
    }
    
    @IBAction func amountButton4Clicked(_ sender: Any) {
        self.btcAmount.text = "0.1"
    }

    @IBAction func amountButton5Clicked(_ sender: Any) {
        self.btcAmount.text = "0.3"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let sb = segue.destination as! ScanQRCodeViewController
        sb.instance = self
    }
    
    @IBAction func sendTransaction(_ sender: Any) {
        var headers = HTTPHeaders.default
        headers["x-api-key"] = apiKey
        headers["user-id"] = userId
        headers["amount"] = self.btcAmount.text
        headers["address"] = self.btcAddress.text
        if self.txComment.text != "" {
            headers["comment"] = self.txComment.text
        }
        
        AF.request("http://176.37.12.50:1234/wallet/sendTransaction", headers: headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Navigate to the success screen
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "SuccessScreen")
                    self.present(newViewController, animated: true, completion: nil)
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

}
