import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language: 'en' | 'hi';
}

interface ChatbotProps {
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock responses in both languages
  const responses = {
    en: {
      greeting: "Hello! I'm your SheharFix assistant. How can I help you today?",
      reportIssue: "To report an issue, click on 'Report Issue' in the sidebar. You can upload photos, add location, and describe the problem.",
      trackIssue: "You can track your reported issues in your dashboard. Each issue has a unique ID and status updates.",
      emergency: "For emergency situations, please contact your local authorities immediately. This system is for non-emergency civic issues.",
      help: "I can help you with:\n• Reporting issues\n• Tracking your reports\n• Understanding the resolution process\n• Navigating the app\n\nWhat would you like to know?",
      default: "I understand you're asking about civic issues. Could you please be more specific? I can help with reporting, tracking, or general information about the SheharFix platform."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका शहरफिक्स सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      reportIssue: "समस्या रिपोर्ट करने के लिए, साइडबार में 'समस्या रिपोर्ट करें' पर क्लिक करें। आप फोटो अपलोड कर सकते हैं, स्थान जोड़ सकते हैं, और समस्या का वर्णन कर सकते हैं।",
      trackIssue: "आप अपने डैशबोर्ड में अपनी रिपोर्ट की गई समस्याओं को ट्रैक कर सकते हैं। प्रत्येक समस्या का एक यूनीक आईडी और स्थिति अपडेट होता है।",
      emergency: "आपातकालीन स्थितियों के लिए, कृपया तुरंत अपने स्थानीय अधिकारियों से संपर्क करें। यह सिस्टम गैर-आपातकालीन नागरिक समस्याओं के लिए है।",
      help: "मैं आपकी मदद कर सकता हूं:\n• समस्याएं रिपोर्ट करना\n• आपकी रिपोर्ट्स ट्रैक करना\n• समाधान प्रक्रिया समझना\n• ऐप नेविगेट करना\n\nआप क्या जानना चाहेंगे?",
      default: "मैं समझता हूं कि आप नागरिक समस्याओं के बारे में पूछ रहे हैं। क्या आप कृपया अधिक स्पष्ट हो सकते हैं? मैं रिपोर्टिंग, ट्रैकिंग, या शहरफिक्स प्लेटफॉर्म के बारे में सामान्य जानकारी में मदद कर सकता हूं।"
    }
  };

  const quickReplies = {
    en: [
      "How to report an issue?",
      "Track my reports",
      "Emergency contact",
      "App help"
    ],
    hi: [
      "समस्या कैसे रिपोर्ट करें?",
      "मेरी रिपोर्ट्स ट्रैक करें",
      "आपातकालीन संपर्क",
      "ऐप सहायता"
    ]
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting when chat opens
      const greeting: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: responses[language].greeting,
        timestamp: new Date(),
        language
      };
      setMessages([greeting]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('report') || msg.includes('रिपोर्ट')) {
      return responses[language].reportIssue;
    } else if (msg.includes('track') || msg.includes('ट्रैक')) {
      return responses[language].trackIssue;
    } else if (msg.includes('emergency') || msg.includes('आपातकाल')) {
      return responses[language].emergency;
    } else if (msg.includes('help') || msg.includes('मदद') || msg.includes('सहायता')) {
      return responses[language].help;
    } else {
      return responses[language].default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
        language
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${className}`}
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-primary rounded-full">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-sm">SheharFix Assistant</CardTitle>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
            <SelectTrigger className="w-20 h-8">
              <Languages className="w-3 h-3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">हि</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'bot' && (
                    <Bot className="w-4 h-4 mt-0.5 text-primary" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-4 h-4 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'en' ? 'Quick replies:' : 'त्वरित उत्तर:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {quickReplies[language].map((reply, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent text-xs"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'en' ? 'Type your message...' : 'अपना संदेश टाइप करें...'}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
