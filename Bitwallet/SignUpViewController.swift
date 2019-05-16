//
//  SignUpViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/16/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Firebase
import FirebaseAuth

class SignUpViewController: UIViewController {
    
    @IBOutlet weak var Email: UITextField!
    @IBOutlet weak var Password: UITextField!
    @IBOutlet weak var SignUpButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Firebase custom event
        Analytics.logEvent("visit_screen", parameters: [
            "name": "Sign Up Screen" as NSObject,
            "full_text": "A user have visited the Sign up screen" as NSObject
            ])
    }
    
    
    @IBAction func SignUpClicked(_ sender: Any) {
        let email = Email.text!
        let password = Password.text!
        
        if (email != "" && password != "") {
            Auth.auth().createUser(withEmail: email, password: password) { authResult, error in
                if error != nil {
                    print(error!._code)
                    self.handleError(error!)
                    return
                }
                print("Auth: \(authResult)")
            }
        } else {
            // Show error message
            let alert = UIAlertController(title: "Oops", message: "You didn't fill out all the fields.", preferredStyle: .alert)
            self.present(alert, animated: true)
            alert.addAction(UIAlertAction(title: "Try again", style: .default, handler: nil))
        }
    }

}
