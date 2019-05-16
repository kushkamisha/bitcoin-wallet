//
//  TransactionsViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/9/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import KeychainSwift
import Firebase

class Transaction: UITableViewCell {
    
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var address: UILabel!
    @IBOutlet weak var btcAmount: UILabel!
    @IBOutlet weak var usdAmount: UILabel!
    @IBOutlet weak var transactionDirection: UIImageView!

}



class TransactionsViewController: UIViewController, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    let times = ["2 minutes ago", "56 minutes ago", "1 week ago"]
    let addresses = ["2N4hR6eczYcGS5crD4sN8pQRhKQSvEqscHz", "2MtKxR2yuRWiWnNihFEmpr71SM71enRNWif", "2MsFibA5mer6KidRbymb8Gp7bvwK9zTKSTB"]
    let btcAmounts = [1.345, 5.0, 0.000001]
    let usdAmounts = [9457, 345, 0.5]
    let transactionDirections = ["in", "out", "out"]
    
    private var token = ""
    private let keychain = KeychainSwift()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Firebase custom event
        Analytics.logEvent("visit_screen", parameters: [
            "name": "Transaction's Screen" as NSObject,
            "full_text": "A user have visited the Transaction's screen" as NSObject
            ])
        
        self.tableView.register(UINib(nibName: "TransactionsCell", bundle: nil), forCellReuseIdentifier: "transaction")
        
        // Get the token from the keychain
        token = self.keychain.get("x-access-token") as! String
        
        // Load user's balance
        getUserTransactions()
    }
    
    func getUserTransactions() {
        AF.request("http://176.37.12.50:8364/wallet/getTransactions", headers: ["x-access-token": token]).responseJSON { response in
            switch response.result {
            case .success(let data):
//                print("\(data)")
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Show all transactions
                    let txs = dict["txs"] as! NSArray
                    for tx in (txs as! [NSDictionary]) {
                        print(tx["address"])
                    }
                    
                    
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
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 3
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell: Transaction = self.tableView.dequeueReusableCell(withIdentifier: "transaction") as! Transaction
        
        cell.timeLabel.text = times[indexPath.row]
        cell.address.text = addresses[indexPath.row]
        cell.btcAmount.text = "\(btcAmounts[indexPath.row]) BTC"
        cell.usdAmount.text = "$\(usdAmounts[indexPath.row])"
        cell.transactionDirection.image = UIImage(named: transactionDirections[indexPath.row])
        
        return cell
    }

}
