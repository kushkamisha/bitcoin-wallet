//
//  LogInViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire

class LogInViewController: UIViewController {

    @IBOutlet weak var UserToken: UILabel!
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
                    let status = dict["status"] as! String
                    let token = dict["token"] as! String
                    self.UserToken.text = "\(token)"
                    self.UserToken.isHidden = false
                case .failure(let error):
                    print(error.localizedDescription)
            }
        }
    }
}
