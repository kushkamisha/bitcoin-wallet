//
//  SendViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/25/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit

class SendViewController: UIViewController {
    
    @IBOutlet weak var btcAddress: UITextField!
    @IBOutlet weak var btcAmount: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let sb = segue.destination as! ScanQRCodeViewController
        sb.instance = self
    }

}
