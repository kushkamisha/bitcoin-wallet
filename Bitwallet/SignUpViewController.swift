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
    
    func goToLoginScreenHandler(alert: UIAlertAction!) {
        // Navigate to the main screen
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "NavigationScreen")
        self.present(newViewController, animated: true, completion: nil)
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
                
                if authResult != nil {
                    // Successfully signed up
                    let alert = UIAlertController(title: "Success", message: "You've signed up. Now you can log in.", preferredStyle: .alert)
                    self.present(alert, animated: true)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: self.goToLoginScreenHandler))
                    alert.addAction(UIAlertAction(title: "Cancel", style: .default, handler: nil))
                } else {
                    // Unknown error
                    let alert = UIAlertController(title: "Oops", message: "Unknown error. Try again.", preferredStyle: .alert)
                    self.present(alert, animated: true)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                }
//                guard let userId = Auth.auth().currentUser?.uid else { return }
//                print("User's UID: \(userId)")
            }
        } else {
            // Show error message
            let alert = UIAlertController(title: "Oops", message: "You didn't fill out all the fields.", preferredStyle: .alert)
            self.present(alert, animated: true)
            alert.addAction(UIAlertAction(title: "Try again", style: .default, handler: nil))
        }
    }

}
