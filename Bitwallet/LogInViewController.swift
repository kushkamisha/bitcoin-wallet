//
//  LogInViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import KeychainSwift

class LogInViewController: UIViewController {

    @IBOutlet weak var GetToken: UIButton!
    @IBOutlet weak var Username: UITextField!
    @IBOutlet weak var Password: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    @IBAction func getTokenClicked(_ sender: Any) {

        AF.request("http://176.37.12.50:8364/auth/login", method: .post, parameters: ["username": Username.text, "password": Password.text]).responseJSON { response in
            switch response.result {
                case .success(let data):
                    let dict = data as! NSDictionary
//                    let status = dict["status"] as! String
                    let token = dict["token"]
                    if (token != nil) {
                        // Save the token to the keychain
                        let keychain = KeychainSwift()
                        keychain.set(token as! String, forKey: "x-access-token")

                        // Navigate to the main screen
                        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                        let newViewController = storyBoard.instantiateViewController(withIdentifier: "MainScreen")
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
