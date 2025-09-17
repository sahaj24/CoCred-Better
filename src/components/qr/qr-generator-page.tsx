"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Palette,
  RefreshCw,
  Eye,
  Check,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  User,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function QRGeneratorPage() {
  const { user } = useAuth();
  const [qrSize, setQrSize] = useState(300);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [contentType, setContentType] = useState<'portfolio' | 'profile' | 'contact' | 'custom'>('portfolio');
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  // Generate different URLs based on content type
  const generateQRData = () => {
    // Hardcoded QR data URL
    return "https://sewsbkwlkdegjuaiccth.supabase.co/storage/v1/object/public/student-uploads/00a6eaa6-a41f-43f3-a57c-c4068d5bda9c/1758099141740_LOC.pdf";
  };

  const qrData = generateQRData();

  const templateColors = {
    default: { bg: '#ffffff', fg: '#000000', name: 'Classic' },
    blue: { bg: '#f8fafc', fg: '#1e40af', name: 'Professional Blue' },
    purple: { bg: '#faf5ff', fg: '#7c3aed', name: 'Creative Purple' },
    green: { bg: '#f0fdf4', fg: '#15803d', name: 'Nature Green' },
    dark: { bg: '#1f2937', fg: '#ffffff', name: 'Dark Mode' }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    const colors = templateColors[template as keyof typeof templateColors];
    setBackgroundColor(colors.bg);
    setForegroundColor(colors.fg);
  };

  const handleDownloadQR = () => {
    // Enhanced download with better naming
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    if (ctx) {
      // Create a more realistic QR code placeholder
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      // Draw QR-like pattern
      ctx.fillStyle = foregroundColor;
      const moduleSize = qrSize / 25;
      
      // Corner patterns
      for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 7; y++) {
          if ((x === 0 || x === 6 || y === 0 || y === 6) || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) {
            ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            ctx.fillRect((18 + x) * moduleSize, y * moduleSize, moduleSize, moduleSize);
            ctx.fillRect(x * moduleSize, (18 + y) * moduleSize, moduleSize, moduleSize);
          }
        }
      }
      
      // Add some random data modules
      for (let i = 0; i < 200; i++) {
        const x = Math.floor(Math.random() * 25);
        const y = Math.floor(Math.random() * 25);
        if (Math.random() > 0.5) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    const link = document.createElement('a');
    link.download = `qr-code-${contentType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyQRUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My QR Code',
          text: 'Check out my portfolio',
          url: qrData,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyQRUrl();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          QR Code Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create beautiful, customizable QR codes for your portfolio, profile, or any custom content. 
          Share your achievements instantly with anyone, anywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - QR Preview */}
        <div className="space-y-6">
          {/* QR Code Preview */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div 
                  className="rounded-xl shadow-lg border-4 border-white"
                  style={{ 
                    backgroundColor: backgroundColor,
                    padding: '20px'
                  }}
                >
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      width: `${qrSize}px`,
                      height: `${qrSize}px`,
                      backgroundColor: backgroundColor,
                      border: `2px solid ${foregroundColor}20`
                    }}
                  >
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=https%3A%2F%2Fsewsbkwlkdegjuaiccth.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fstudent-uploads%2F00a6eaa6-a41f-43f3-a57c-c4068d5bda9c%2F1758099141740_LOC.pdf&qzone=1&margin=0&size=400x400&ecc=L"
                      alt="QR Code"
                      className="rounded-lg"
                      style={{
                        width: `${qrSize}px`,
                        height: `${qrSize}px`,
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Device Preview */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Monitor className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600">Desktop</span>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Tablet className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-600">Tablet</span>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600">Mobile</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleDownloadQR} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={shareQR} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL to share:</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={qrData} 
                    readOnly 
                    className="text-sm bg-gray-50 border-gray-200"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyQRUrl}
                    className={copied ? "bg-green-50 border-green-200 text-green-700" : ""}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customization */}
        <div className="space-y-6">
          {/* Content Type Selection */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Content Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'portfolio', icon: Globe, label: 'Portfolio', desc: 'Full portfolio showcase' },
                  { type: 'profile', icon: User, label: 'Profile', desc: 'Basic profile info' },
                  { type: 'contact', icon: FileText, label: 'Contact', desc: 'vCard format' },
                  { type: 'custom', icon: ExternalLink, label: 'Custom', desc: 'Custom URL/text' }
                ].map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setContentType(type as any)}
                    className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 ${
                      contentType === type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${contentType === type ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`font-medium text-sm ${contentType === type ? 'text-blue-900' : 'text-gray-900'}`}>
                        {label}
                      </span>
                    </div>
                    <p className={`text-xs ${contentType === type ? 'text-blue-600' : 'text-gray-500'}`}>
                      {desc}
                    </p>
                  </button>
                ))}
              </div>

              {contentType === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-message">Custom URL or Message</Label>
                  <Input
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom URL or message"
                    className="bg-white border-gray-200"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Style Templates */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Style Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(templateColors).map(([key, { bg, fg, name }]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateSelect(key)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded border" 
                        style={{ backgroundColor: bg, borderColor: fg }}
                      />
                      <div 
                        className="w-4 h-4 rounded border" 
                        style={{ backgroundColor: fg }}
                      />
                    </div>
                    <span className={`font-medium text-sm ${
                      selectedTemplate === key ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Customization */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-600" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="qr-size">Size</Label>
                  <Badge variant="outline">{qrSize}px</Badge>
                </div>
                <input
                  id="qr-size"
                  type="range"
                  min="200"
                  max="500"
                  step="50"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input 
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="fg-color"
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input 
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setQrSize(300);
                  setBackgroundColor("#ffffff");
                  setForegroundColor("#000000");
                  setContentType('portfolio');
                  setCustomMessage("");
                  setSelectedTemplate('default');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}