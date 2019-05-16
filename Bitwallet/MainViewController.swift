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
import Firebase

class MainViewController: UIViewController {

    @IBOutlet weak var UserBalance: UILabel!

    private var token = ""
    private let keychain = KeychainSwift()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Firebase custom event
        Analytics.logEvent("visit_screen", parameters: [
            "name": "Main Screen" as NSObject,
            "full_text": "A user have visited the Main screen" as NSObject
            ])

        // Get the token from the keychain
        token = self.keychain.get("x-access-token") as! String
        
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
    
    @IBAction func logout(_ sender: Any) {
        self.keychain.delete("x-access-token")

        // Navigate to the login screen
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "LoginScreen")
        self.present(newViewController, animated: true, completion: nil)
    }

}
