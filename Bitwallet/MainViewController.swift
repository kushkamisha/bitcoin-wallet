//
//  MainViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/7/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Alamofire
import Firebase
import FirebaseAuth

public var btcRatesGlobal : Double = 0.1

class MainViewController: UIViewController {

    @IBOutlet weak var UserBalance: UILabel!
    @IBOutlet weak var UserUsdBalance: UILabel!
    @IBOutlet weak var BtcRates: UILabel!
    @IBOutlet weak var refreshButton: UIButton!
    @IBOutlet weak var change24hArrow: UIImageView!
    @IBOutlet weak var change24hText: UILabel!
    
    private let userId = Auth.auth().currentUser?.uid
    private let apiKey = "b4tXEhQaUmYyAUBMf0SMSoFzcVkXZ64JnCprKWc8iZyv8KiX8kNuQsoB"
    private var headers = HTTPHeaders.default
    private var btcBalance : Double = 0.0
    private var btcBalanceCompletionFlag : Bool = false
    private var btcRatesCompletionFlag : Bool = false

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Firebase custom event
        Analytics.logEvent("visit_screen", parameters: [
            "name": "Main Screen" as NSObject,
            "full_text": "A user have visited the Main screen" as NSObject
            ])
        
        // Set API headers
        headers["x-api-key"] = apiKey
        headers["user-id"] = userId
        
        // Call API methods
        loadUserBtcBalance(onCompleted: {
            self.btcBalanceCompletionFlag = true
            self.calcUsdBalance()
        })
        loadBtcRates(onCompleted: {
            self.btcRatesCompletionFlag = true
            self.calcUsdBalance()
        })
    }
    
    func loadUserBtcBalance(onCompleted: @escaping () -> Void) {
        AF.request("http://127.0.0.1:8364/wallet/getbalance", headers: self.headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Set user's balance label
                    var balance = dict["balance"] as! Double
                    balance = round(balance * 1e6) / 1e6
                    self.UserBalance.text = "\(balance) BTC"
                    self.btcBalance = balance
                    
                    onCompleted()
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
    
    func loadBtcRates(onCompleted: @escaping () -> Void) {
        AF.request("http://127.0.0.1:8364/rates/btcusd", headers: self.headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                let dict = data as! NSDictionary
                let status = dict["status"] as! String
                if (status == "success") {
                    // Set BTC rates label
                    var price = dict["price"] as! Double
                    price = round(price * 1e2) / 1e2
                    var change = dict["change24h"] as! Double
                    change = round(change * 1e4) / 1e2
                    if (change >= 0) {
                        self.change24hText.text = "\(change)%"
                        self.change24hArrow.image = UIImage(named: "in")
                    } else {
                        self.change24hText.text = "\(-change)%"
                        self.change24hArrow.image = UIImage(named: "out")
                    }
                    
                    self.BtcRates.text = "1 BTC = $\(price)"
                    btcRatesGlobal = price

                    onCompleted()
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
    
    func calcUsdBalance() {
        if (self.btcBalanceCompletionFlag && self.btcRatesCompletionFlag) {
            self.UserUsdBalance.text = "$\(round(btcRatesGlobal * self.btcBalance * 1e2) / 1e2)"
            self.refreshButton.layer.removeAllAnimations()
        }
    }
    
    func rotateButtonAnimation(imageView: UIButton, speed: Double) { //CABasicAnimation
        let rotationAnimation = CABasicAnimation(keyPath: "transform.rotation")
        rotationAnimation.fromValue = 0.0
        rotationAnimation.toValue = Double.pi * 2 //Minus can be Direction
        rotationAnimation.duration = speed
        rotationAnimation.repeatCount = .infinity
        imageView.layer.add(rotationAnimation, forKey: nil)
    }
    
    @IBAction func refreshData(_ sender: Any) {
        // Animate the refresh button
        self.rotateButtonAnimation(imageView: self.refreshButton, speed: 0.5)
        
        // Reset function flags
        self.btcBalanceCompletionFlag = false
        self.btcRatesCompletionFlag = false

        // Refresh all the API data
        loadUserBtcBalance(onCompleted: {
            self.btcBalanceCompletionFlag = true
            self.calcUsdBalance()
        })
        loadBtcRates(onCompleted: {
            self.btcRatesCompletionFlag = true
            self.calcUsdBalance()
        })
    }
    
    @IBAction func logout(_ sender: Any) {
        // Navigate to the login screen
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "LoginScreen")
        self.present(newViewController, animated: true, completion: nil)
    }

}
