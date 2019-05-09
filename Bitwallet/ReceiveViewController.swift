//
//  ReceiveViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/9/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import KeychainSwift

class ReceiveViewController: UIViewController {
    
    @IBOutlet weak var UserAddress: UITextField!
    
    private var token = ""
    private let keychain = KeychainSwift()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Get the token from the keychain
        token = self.keychain.get("x-access-token") as! String
        
        // Load user's balance
        getUserAddress()
    }
    
    func getUserAddress() {
        AF.request("http://176.37.12.50:8364/wallet/createAddress", headers: ["x-access-token": token]).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Set user balance label
                    let address = dict["address"] as! String
                    self.UserAddress.text = address
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