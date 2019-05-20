//
//  LogInViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Firebase
import FirebaseAuth

class LogInViewController: UIViewController {

    @IBOutlet weak var Username: UITextField!
    @IBOutlet weak var Password: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @IBAction func loginClicked(_ sender: Any) {
        callLoginMethod()
    }
    
    func callLoginMethod() {
        let email = Username.text!
        let password = Password.text!
        
        if (email != "" && password != "") {
            Auth.auth().signIn(withEmail: email, password: password) { authResult, error in
                if error != nil {
                    print(error!._code)
                    self.handleError(error!)
                    return
                }
                
                if authResult != nil {
                    // Navigate to the main screen
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "NavigationScreen")
                    self.present(newViewController, animated: true, completion: nil)
                } else {
                    // Unknown error
                    let alert = UIAlertController(title: "Oops", message: "Unknown error. Try again.", preferredStyle: .alert)
                    self.present(alert, animated: true)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                }
                guard let userId = Auth.auth().currentUser?.uid else { return }
                print("User's UID: \(userId)")
            }
        } else {
            // Show error message
            let alert = UIAlertController(title: "Oops", message: "You didn't fill out all the fields.", preferredStyle: .alert)
            self.present(alert, animated: true)
            alert.addAction(UIAlertAction(title: "Try again", style: .default, handler: nil))
        }
    }

}
