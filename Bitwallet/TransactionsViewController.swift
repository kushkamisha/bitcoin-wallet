//
//  TransactionsViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/9/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import Firebase
import FirebaseAuth

class Transaction: UITableViewCell {
    
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var address: UILabel!
    @IBOutlet weak var btcAmount: UILabel!
    @IBOutlet weak var usdAmount: UILabel!
    @IBOutlet weak var transactionDirection: UIImageView!

}

class TransactionsViewController: UIViewController, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var time : Array<Int> = []
    var timeString: Array<String> = []
    var txids : Array<String> = []
    var btcAmounts : Array<Double> = []
    var usdAmounts : Array<Double> = []
    var transactionDirections : Array<String> = []
    
    private let userId = Auth.auth().currentUser?.uid
    private let apiKey = "b4tXEhQaUmYyAUBMf0SMSoFzcVkXZ64JnCprKWc8iZyv8KiX8kNuQsoB"
    private var refresher : UIRefreshControl!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Pull from top to refresh the txs list
        refresher = UIRefreshControl()
//        refresher.attributedTitle = NSAttributedString(string: "Pull to refresh")
        refresher.addTarget(self, action: #selector(TransactionsViewController.updateTable), for: UIControl.Event.valueChanged)
        tableView.addSubview(refresher)
        
        // Firebase custom event
        Analytics.logEvent("visit_screen", parameters: [
            "name": "Transaction's Screen" as NSObject,
            "full_text": "A user have visited the Transaction's screen" as NSObject
            ])
        
        self.tableView.register(UINib(nibName: "TransactionsCell", bundle: nil), forCellReuseIdentifier: "transaction")
        
        // Load user's balance
        getUserTransactions()
    }
    
    func unixTimeToText(time : Array<Int>) -> Array<String> {
        var stringTime : Array<String> = []
        let currentTime = Int(NSDate().timeIntervalSince1970)
        let (minute, hour, day, week, month, year) = (60, 3600, 86400, 604800, 2419200, 943488000)
        
        for t in time {
            let diff = currentTime - t
            switch(diff) {
            case 0...minute - 1:
                stringTime.append("just now")
            case minute...hour - 1:
                let minutes = Int(diff / minute)
                stringTime.append("\(minutes) minutes ago")
            case hour...day - 1:
                let hours = Int(diff / hour)
                stringTime.append("\(hours) hours ago")
            case day...week - 1:
                let days = Int(diff / day)
                stringTime.append("\(days) days ago")
            case week...month - 1:
                let weeks = Int(diff / week)
                stringTime.append("\(weeks) weeks ago")
            case month...year - 1:
                let months = Int(diff / month)
                stringTime.append("\(months) months ago")
            case year...50*year:
                let years = Int(diff / year)
                stringTime.append("\(years) years ago")
            default:
                stringTime.append("a long time ago")
            }
        }
        
        return stringTime
    }
    
    func getUserTransactions() {
        // Clear all txs arrays
        time = []
        timeString = []
        txids = []
        btcAmounts = []
        usdAmounts = []
        transactionDirections = []

        var headers = HTTPHeaders.default
        headers["x-api-key"] = apiKey
        headers["user-id"] = userId
        
        AF.request("http://176.37.12.50:1234/wallet/getTransactions", headers: headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String

                if (status == "success") {
                    // Show all transactions
                    let txs = dict["txs"] as! NSArray
                    for tx in (txs as! [NSDictionary]) {
                        self.time.append(tx["time"]! as! Int)
                        self.btcAmounts.append(tx["amount"] as! Double)
                        self.usdAmounts.append(round((tx["amount"] as! Double) * btcRatesGlobal * 1e2) / 1e2)
                        self.transactionDirections.append(tx["category"]! as! String == "receive" ? "in" : "out")
                        self.txids.append((tx["confirmations"]! as? NSNumber ?? 0).intValue > 0 ? tx["txid"]! as! String : "pending...")
                    }
                    
                    self.timeString = self.unixTimeToText(time: self.time)
                    self.tableView.reloadData()
                    
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
        return time.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell: Transaction = self.tableView.dequeueReusableCell(withIdentifier: "transaction") as! Transaction
        
        cell.timeLabel.text = timeString[indexPath.row]
        cell.address.text = txids[indexPath.row]
        cell.btcAmount.text = "\(btcAmounts[indexPath.row]) BTC"
        cell.usdAmount.text = "$\(usdAmounts[indexPath.row])"
        cell.transactionDirection.image = UIImage(named: transactionDirections[indexPath.row])
        
        return cell
    }
    
    @objc func updateTable() {
        getUserTransactions()
        self.refresher.endRefreshing()
    }

}
