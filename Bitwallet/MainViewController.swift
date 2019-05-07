//
//  MainViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import KeychainSwift

class MainViewController: UIViewController {
    
    private var token = ""
    
    @IBOutlet weak var UserBalance: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Get the token from the keychain
        let keychain = KeychainSwift()
        token = keychain.get("x-access-token") as! String
        
        // Load user's balance
        loadUserBalance()
    }
    
    func loadUserBalance() {
        AF.request("http://176.37.12.50:8364/wallet/getbalance", headers: ["x-access-token": token]).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Set user balance label
                    let balance = dict["balance"] as! NSNumber
                    self.UserBalance.text = "\(balance) BTC"
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
