//
//  LogInViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit

class LogInViewController: UIViewController {

    @IBOutlet weak var UserToken: UILabel!
    @IBOutlet weak var GetToken: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    @IBAction func getTokenClicked(_ sender: Any) {
        UserToken.isHidden = false
    }
}
