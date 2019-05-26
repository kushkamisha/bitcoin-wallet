//
//  ScanQRCodeViewController.swift
//  Bitwallet
//
//  Created by Kushka Misha on 5/26/19.
//  Copyright © 2019 Misha Kushka. All rights reserved.
//

import UIKit
import AVFoundation
import Loaf

class ScanQRCodeViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!
    var instance: SendViewController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = UIColor.black
        captureSession = AVCaptureSession()
        
        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return }
        let videoInput: AVCaptureDeviceInput
        
        do {
            videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
        } catch {
            return
        }
        
        if (captureSession.canAddInput(videoInput)) {
            captureSession.addInput(videoInput)
        } else {
            failed()
            return
        }
        
        let metadataOutput = AVCaptureMetadataOutput()
        
        if (captureSession.canAddOutput(metadataOutput)) {
            captureSession.addOutput(metadataOutput)
            
            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else {
            failed()
            return
        }
        
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        
        captureSession.startRunning()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func failed() {
        let ac = UIAlertController(title: "Scanning not supported", message: "Your device does not support scanning a code from an item. Please use a device with a camera.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "OK", style: .default))
        present(ac, animated: true)
        captureSession = nil
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        if (captureSession?.isRunning == false) {
            captureSession.startRunning()
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        if (captureSession?.isRunning == true) {
            captureSession.stopRunning()
        }
    }
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            found(code: stringValue)
        }
    }
    
    func found(code: String) {
        // Stop the capture session only if QR code has the right format
        if code.starts(with: "bitcoin:") {
            captureSession.stopRunning()
            
            self.parseData(code: code)

            // Navigate to the send screen
            _ = navigationController?.popViewController(animated: true)
        } else {
            Loaf("The QR code has incorrect format", state: .warning, sender: self).show()
        }
    }
    
    func parseData(code: String) {
        // Pass the data to the send screen
        
        // Get rid of "bitcoin:" at the beginning
        let start = code.index(code.startIndex, offsetBy: 8)
        let end = code.index(code.endIndex, offsetBy: 0)
        let btcString = String(code[start..<end])
        
        // 2
        let chunks = btcString.split(separator: "?")
        for chunk in chunks {
            if chunk.starts(with: "amount=") {
                let start = chunk.index(chunk.startIndex, offsetBy: 7)
                let end = chunk.index(chunk.endIndex, offsetBy: 0)
                let amount = chunk[start..<end]
                instance?.btcAmount.text = "\(amount)"
                print("Amount: \(amount)")
                
            } else {
                print("BTC address: \(chunk)")
                instance?.btcAddress.text = "\(chunk)"
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let sb = segue.destination as! SendViewController
        sb.btcAddress.text = ":)"
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait
    }
}
