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

class Transaction: UITableViewCell {
    
    @IBOutlet weak var timeLabel: UILabel!
    
}



class TransactionsViewController: UIViewController, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    private var token = ""
    private let keychain = KeychainSwift()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView.register(UINib(nibName: "TransactionsCell", bundle: nil), forCellReuseIdentifier: "transaction")
        
        // Get the token from the keychain
//        token = self.keychain.get("x-access-token") as! String
        
        // Load user's balance
//        getUserTransactions()
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
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell: Transaction = self.tableView.dequeueReusableCell(withIdentifier: "transaction") as! Transaction
        
        cell.timeLabel.text = "now"
//        cell.timeLabel.text = "Now :)"
//        cell.time.text = "Now"
//        cell.addressLabel.text = "344853874653756"
//        cell.amountLabel.text = "50 BTC"
//        cell.directionImage
        
        return cell
    }

}
