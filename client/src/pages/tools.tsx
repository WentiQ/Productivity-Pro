import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Type, 
  Image, 
  Palette, 
  QrCode, 
  Link, 
  Download,
  Upload,
  Scissors,
  Combine,
  RotateCcw,
  Copy,
  Check,
  Hash,
  Search,
  Zap
} from "lucide-react";

export default function Tools() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pdf");

  // PDF Tools State
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfProcessing, setPdfProcessing] = useState(false);

  // Text Tools State
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Image Tools State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");

  // Color Tools State
  const [selectedColor, setSelectedColor] = useState("#4CAF50");
  const [colorInput, setColorInput] = useState("#4CAF50");

  // QR Code State
  const [qrText, setQrText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // URL Tools State
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  // PDF Tools Functions
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPdfFiles(Array.from(files));
    }
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setPdfProcessing(true);
    // Simulate PDF processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPdfProcessing(false);
    
    toast({
      title: "Success",
      description: "PDFs merged successfully!",
    });
  };

  // Text Tools Functions
  const analyzeText = (text: string) => {
    setTextInput(text);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  };

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    let converted = "";
    switch (type) {
      case 'upper':
        converted = textInput.toUpperCase();
        break;
      case 'lower':
        converted = textInput.toLowerCase();
        break;
      case 'title':
        converted = textInput.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        converted = textInput.charAt(0).toUpperCase() + textInput.slice(1).toLowerCase();
        break;
    }
    setTextOutput(converted);
  };

  const cleanText = () => {
    const cleaned = textInput
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/[^\w\s]/gi, '');
    setTextOutput(cleaned);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  // Image Tools Functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const resizeImage = async () => {
    if (!imageFile || !imageWidth || !imageHeight) {
      toast({
        title: "Error",
        description: "Please upload an image and specify dimensions",
        variant: "destructive",
      });
      return;
    }

    // Simulate image processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Success",
      description: "Image resized successfully!",
    });
  };

  // QR Code Functions
  const generateQrCode = () => {
    if (!qrText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate QR code",
        variant: "destructive",
      });
      return;
    }

    // Using QR Server API for demonstration
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
    setQrCodeUrl(qrUrl);
    
    toast({
      title: "Success",
      description: "QR code generated successfully!",
    });
  };

  // URL Tools Functions
  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    // Simulate URL shortening
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShortUrl(`https://short.ly/${Math.random().toString(36).substr(2, 8)}`);
    
    toast({
      title: "Success",
      description: "URL shortened successfully!",
    });
  };

  const expandUrl = async () => {
    if (!shortUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a short URL to expand",
        variant: "destructive",
      });
      return;
    }

    // Simulate URL expansion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success",
      description: "URL expanded successfully!",
    });
  };

  // Color Tools Functions
  const getColorInfo = (color: string) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;
    
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    let h = 0;
    if (diff !== 0) {
      if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
      else h = (rNorm - gNorm) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return {
      hex: color.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  };

  const colorInfo = getColorInfo(selectedColor);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Productivity Tools</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Essential tools to enhance your workflow</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          {/* PDF Tools */}
          <TabsContent value="pdf" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-red-600" />
                    Merge PDFs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">Select PDF Files</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="mt-1"
                    />
                  </div>
                  {pdfFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files:</Label>
                      {pdfFiles.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button 
                    onClick={mergePdfs} 
                    disabled={pdfFiles.length < 2 || pdfProcessing}
                    className="w-full"
                  >
                    {pdfProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Merge PDFs'
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scissors className="w-5 h-5 mr-2 text-blue-600" />
                    Split PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-split">Select PDF File</Label>
                    <Input
                      id="pdf-split"
                      type="file"
                      accept=".pdf"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="page-range">Page Range (e.g., 1-5)</Label>
                    <Input
                      id="page-range"
                      placeholder="1-5"
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full">Split PDF</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Combine className="w-5 h-5 mr-2 text-green-600" />
                    Combine PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-compress">Select PDF File</Label>
                    <Input
                      id="pdf-compress"
                      type="file"
                      accept=".pdf"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Compression Level</Label>
                    <select className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                      <option>Low (Best Quality)</option>
                      <option>Medium</option>
                      <option>High (Smallest Size)</option>
                    </select>
                  </div>
                  <Button className="w-full">Combine PDF</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Text Tools */}
          <TabsContent value="text" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="w-5 h-5 mr-2" />
                    Text Analyzer & Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Input Text</Label>
                    <Textarea
                      id="text-input"
                      value={textInput}
                      onChange={(e) => analyzeText(e.target.value)}
                      placeholder="Enter your text here..."
                      className="mt-1 min-h-32"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Words:</span>
                      <span className="ml-2 font-medium">{wordCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Characters:</span>
                      <span className="ml-2 font-medium">{charCount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => convertCase('upper')}>
                      UPPERCASE
                    </Button>
                    <Button size="sm" onClick={() => convertCase('lower')}>
                      lowercase
                    </Button>
                    <Button size="sm" onClick={() => convertCase('title')}>
                      Title Case
                    </Button>
                    <Button size="sm" onClick={() => convertCase('sentence')}>
                      Sentence case
                    </Button>
                  </div>

                  <Button onClick={cleanText} variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Clean Text
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-output">Converted Text</Label>
                    <Textarea
                      id="text-output"
                      value={textOutput}
                      readOnly
                      placeholder="Converted text will appear here..."
                      className="mt-1 min-h-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => copyToClipboard(textOutput)}
                    disabled={!textOutput}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Image Tools */}
          <TabsContent value="image" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Image Resizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Select Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                  </div>
                  
                  {imageFile && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Selected: {imageFile.name}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        value={imageWidth}
                        onChange={(e) => setImageWidth(e.target.value)}
                        placeholder="800"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        value={imageHeight}
                        onChange={(e) => setImageHeight(e.target.value)}
                        placeholder="600"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={resizeImage} className="w-full">
                    Resize Image
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Format Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="convert-upload">Select Image</Label>
                    <Input
                      id="convert-upload"
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Convert To</Label>
                    <select className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                      <option>JPEG</option>
                      <option>PNG</option>
                      <option>WebP</option>
                      <option>BMP</option>
                    </select>
                  </div>

                  <div>
                    <Label>Quality (JPEG only)</Label>
                    <Input
                      type="range"
                      min="1"
                      max="100"
                      defaultValue="90"
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full">Convert Image</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Combine className="w-5 h-5 mr-2" />
                    Image Compressor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="compress-upload">Select Image</Label>
                    <Input
                      id="compress-upload"
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Compression Level</Label>
                    <Input
                      type="range"
                      min="1"
                      max="100"
                      defaultValue="70"
                      className="mt-1"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Max Compression</span>
                      <span>Best Quality</span>
                    </div>
                  </div>

                  <Button className="w-full">Combine Image</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Color Tools */}
          <TabsContent value="color" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Picker & Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="color-picker">Pick a Color</Label>
                    <Input
                      id="color-picker"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="mt-1 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color-input">Or Enter Color Code</Label>
                    <Input
                      id="color-input"
                      value={colorInput}
                      onChange={(e) => {
                        setColorInput(e.target.value);
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                          setSelectedColor(e.target.value);
                        }
                      }}
                      placeholder="#4CAF50"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>HEX</Label>
                      <div className="flex">
                        <Input value={colorInfo.hex} readOnly className="flex-1" />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(colorInfo.hex)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>RGB</Label>
                      <div className="flex">
                        <Input value={colorInfo.rgb} readOnly className="flex-1" />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(colorInfo.rgb)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>HSL</Label>
                      <div className="flex">
                        <Input value={colorInfo.hsl} readOnly className="flex-1" />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(colorInfo.hsl)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Preview & Palette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Selected Color</Label>
                    <div 
                      className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600 mt-1"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>

                  <div>
                    <Label>Color Palette</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {['#FF5722', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'].map((color) => (
                        <button
                          key={color}
                          className="w-full h-12 rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Contrast Checker</Label>
                    <div className="p-4 rounded-lg mt-2" style={{ backgroundColor: selectedColor }}>
                      <div className="text-white font-medium">White Text</div>
                      <div className="text-black font-medium">Black Text</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QR Code Tools */}
          <TabsContent value="qr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    QR Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="qr-text">Text or URL</Label>
                    <Textarea
                      id="qr-text"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="Enter text, URL, or data to encode..."
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Size</Label>
                      <select className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                        <option>200x200</option>
                        <option>300x300</option>
                        <option>500x500</option>
                        <option>1000x1000</option>
                      </select>
                    </div>
                    <div>
                      <Label>Format</Label>
                      <select className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                        <option>PNG</option>
                        <option>SVG</option>
                        <option>PDF</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={generateQrCode} className="w-full">
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qrCodeUrl ? (
                    <>
                      <div className="flex justify-center">
                        <img src={qrCodeUrl} alt="Generated QR Code" className="border border-gray-300 dark:border-gray-600 rounded-lg" />
                      </div>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">QR code will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* URL Tools */}
          <TabsContent value="url" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Link className="w-5 h-5 mr-2" />
                    URL Shortener
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="long-url">Long URL</Label>
                    <Input
                      id="long-url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://example.com/very/long/url/path"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={shortenUrl} className="w-full">
                    Shorten URL
                  </Button>

                  {shortUrl && (
                    <div>
                      <Label>Shortened URL</Label>
                      <div className="flex mt-1">
                        <Input value={shortUrl} readOnly className="flex-1" />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(shortUrl)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    URL Analyzer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="analyze-url">URL to Analyze</Label>
                    <Input
                      id="analyze-url"
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full">Analyze URL</Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge variant="secondary">Ready</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Content Type:</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Content Length:</span>
                      <span>-</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
