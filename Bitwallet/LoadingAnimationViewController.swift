//
//  LoadingAnimationViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/27/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import Lottie

class LoadingAnimationViewController: UIViewController {
    
    var animationView = AnimationView()
    @IBOutlet weak var okButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        okButton.round(corners: [.allCorners], radius: 5)
        
        startAnimation()
    }
    
    @IBAction func OkClicked(_ sender: Any) {
        animationView.stop()
        // Navigate to the main screen
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "NavigationScreen")
        self.present(newViewController, animated: true, completion: nil)
    }
    
    func startAnimation() {
        let animation = Animation.named("success")
        
        animationView.animation = animation
//        animationView.loopMode = .loop
        animationView.contentMode = .scaleAspectFit
//        animationView.tag = 123
        view.addSubview(animationView)
        
        animationView.backgroundBehavior = .pauseAndRestore
        animationView.translatesAutoresizingMaskIntoConstraints = false
        animationView.topAnchor.constraint(equalTo: view.layoutMarginsGuide.topAnchor).isActive = true
        animationView.leadingAnchor.constraint(equalTo: view.leadingAnchor).isActive = true
        
        animationView.trailingAnchor.constraint(equalTo: view.trailingAnchor).isActive = true
        animationView.setContentCompressionResistancePriority(.fittingSizeLevel, for: .horizontal)
        
        animationView.play()
////        view.willRemoveSubview(animationView)
//        animationView.removeFromSuperview()
//
//        Timer.scheduledTimer(withTimeInterval: 3.0, repeats: false, block: { _ in
//            self.animationView.stop()
//            self.view.willRemoveSubview(self.animationView)
////            if let viewWithTag = self.view.viewWithTag(123) {
////                viewWithTag.removeFromSuperview()
////            }
//            // Navigate to the main screen
//            let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
//            let newViewController = storyBoard.instantiateViewController(withIdentifier: "NavigationScreen")
//            self.present(newViewController, animated: true, completion: nil)
//        })
    }

}
