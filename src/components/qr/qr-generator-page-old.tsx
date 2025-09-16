"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Palette,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function QRGeneratorPage() {
  const { user } = useAuth();
  const [qrSize, setQrSize] = useState(200);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [includeProfile, setIncludeProfile] = useState(true);
  const [customMessage, setCustomMessage] = useState("");

  // Generate portfolio URL
  const portfolioUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/share/${user?.id}`;
  
  // QR code data - in real app this would generate actual QR code
  const qrData = includeProfile ? portfolioUrl : (customMessage || portfolioUrl);

  const handleDownloadQR = () => {
    // In real implementation, this would generate and download the actual QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    if (ctx) {
      // Simple placeholder - in real app use QR library
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, qrSize, qrSize);
      ctx.fillStyle = foregroundColor;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', qrSize/2, qrSize/2);
    }
    
    // Download
    const link = document.createElement('a');
    link.download = `${user?.user_metadata?.full_name || 'portfolio'}-qr-code.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(qrData);
    // In real app, show toast notification
    alert('URL copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <QrCode className="h-8 w-8 text-[#2161FF]" />
          QR Code Generator
        </h1>
        <p className="text-gray-600">Generate QR codes for easy sharing of your portfolio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {/* QR Code Placeholder */}
            <div 
              className="border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg"
              style={{ 
                width: qrSize, 
                height: qrSize,
                backgroundColor: backgroundColor
              }}
            >
              <div className="text-center">
                <QrCode 
                  className="h-16 w-16 mx-auto mb-2" 
                  style={{ color: foregroundColor }}
                />
                <p className="text-sm text-gray-500">QR Code Preview</p>
              </div>
            </div>

            {/* QR URL Display */}
            <div className="w-full">
              <Label className="text-sm font-medium">QR Code URL:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  value={qrData} 
                  readOnly 
                  className="text-sm"
                />
                <Button size="sm" variant="outline" onClick={copyQRUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 w-full">
              <Button onClick={handleDownloadQR} className="flex-1 bg-[#2161FF] hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share QR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customization Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Size */}
            <div>
              <Label htmlFor="qr-size">QR Code Size: {qrSize}px</Label>
              <input
                id="qr-size"
                type="range"
                min="100"
                max="400"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input 
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Foreground Color */}
            <div>
              <Label htmlFor="fg-color">Foreground Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  id="fg-color"
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input 
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Content Options */}
            <div className="space-y-3">
              <Label>QR Code Content</Label>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={includeProfile}
                    onChange={() => setIncludeProfile(true)}
                    className="w-4 h-4 text-[#2161FF] border-gray-300 focus:ring-[#2161FF]"
                  />
                  <span className="text-sm">Portfolio URL</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!includeProfile}
                    onChange={() => setIncludeProfile(false)}
                    className="w-4 h-4 text-[#2161FF] border-gray-300 focus:ring-[#2161FF]"
                  />
                  <span className="text-sm">Custom URL/Text</span>
                </label>
              </div>

              {!includeProfile && (
                <div>
                  <Label htmlFor="custom-message">Custom URL or Message</Label>
                  <Input
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom URL or message"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Reset Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setQrSize(200);
                setBackgroundColor("#ffffff");
                setForegroundColor("#000000");
                setIncludeProfile(true);
                setCustomMessage("");
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Eye className="h-6 w-6" />
              <span className="text-sm">Preview Portfolio</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Share2 className="h-6 w-6" />
              <span className="text-sm">Share via Email</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span className="text-sm">Bulk Download</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For Digital Use:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add to email signatures</li>
                <li>• Include in digital presentations</li>
                <li>• Share on social media</li>
                <li>• Embed in websites</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Print Use:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add to business cards</li>
                <li>• Include in resumes</li>
                <li>• Print on promotional materials</li>
                <li>• Add to posters/flyers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}