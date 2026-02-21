import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import type { BikeData } from '@/hooks/useBikeData';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const quickQuestions = [
  "Why is my engine overheating?",
  "Is it safe to ride?",
  "When should I service my bike?",
  "How to improve fuel efficiency?",
  "What does abnormal vibration mean?",
];

function generateResponse(question: string, data: BikeData): string {
  const q = question.toLowerCase();

  if (q.includes('overheat') || q.includes('temperature') || q.includes('engine hot')) {
    if (data.engineTemp > 100) {
      return `⚠️ **Engine Temperature Alert**\n\nYour engine is currently at **${data.engineTemp}°C**, which is above the safe range (70-95°C).\n\n**Possible causes:**\n1. Low coolant levels\n2. Faulty thermostat\n3. Prolonged high-RPM riding\n4. Clogged radiator fins\n\n**Immediate steps:**\n- Stop riding and let the engine cool for 15-20 minutes\n- Check coolant level and top up if needed\n- Inspect radiator for blockages\n\n**Estimated repair cost:** ₹500-₹3,000 depending on the cause.`;
    }
    return `✅ Your engine temperature is **${data.engineTemp}°C** — within the normal range (70-95°C). No overheating detected. Keep monitoring during long rides or hot weather.`;
  }

  if (q.includes('safe to ride') || q.includes('can i ride')) {
    const issues: string[] = [];
    if (data.engineTemp > 105) issues.push(`Engine temp high (${data.engineTemp}°C)`);
    if (data.fuelLevel < 10) issues.push(`Fuel critically low (${data.fuelLevel}%)`);
    if (data.brakeCondition < 40) issues.push(`Brake condition poor (${data.brakeCondition}%)`);
    if (data.tirePressureFront < 25) issues.push(`Front tire pressure low (${data.tirePressureFront} PSI)`);
    if (data.tirePressureRear < 25) issues.push(`Rear tire pressure low (${data.tirePressureRear} PSI)`);
    if (data.batteryHealth < 30) issues.push(`Battery health degraded (${data.batteryHealth}%)`);
    if (data.engineVibration > 50) issues.push(`High engine vibration (${data.engineVibration}hz)`);

    if (issues.length === 0) {
      return `✅ **All systems are within safe parameters.** It is safe to ride!\n\n- Engine: ${data.engineTemp}°C ✓\n- Fuel: ${data.fuelLevel}% ✓\n- Brakes: ${data.brakeCondition}% ✓\n- Tires: ${data.tirePressureFront}/${data.tirePressureRear} PSI ✓\n- Battery: ${data.batteryHealth}% ✓\n\nRide safe! 🏍️`;
    }
    return `⚠️ **Caution recommended before riding:**\n\n${issues.map(i => `- ${i}`).join('\n')}\n\nPlease address ${issues.length > 1 ? 'these issues' : 'this issue'} before riding. ${issues.some(i => i.includes('critically') || i.includes('poor')) ? '**Not recommended to ride.**' : 'Short rides may be okay, but schedule maintenance soon.'}`;
  }

  if (q.includes('service') || q.includes('maintenance')) {
    return `🔧 **Recommended Service Schedule:**\n\n| Service | Interval | Status |\n|---------|----------|--------|\n| Oil Change | Every 3,000 km | ${data.totalDistance % 3000 < 500 ? '⚠️ Due soon' : '✅ OK'} |\n| Brake Pads | Every 10,000 km | ${data.brakeCondition < 50 ? '⚠️ Check needed' : '✅ OK'} |\n| Air Filter | Every 5,000 km | ✅ OK |\n| Spark Plug | Every 8,000 km | ✅ OK |\n| Chain Lube | Every 500 km | ✅ OK |\n\n**Current odometer:** ${data.totalDistance.toLocaleString()} km\n\n💡 Based on your riding pattern, schedule your next service within the next 200 km.`;
  }

  if (q.includes('fuel') || q.includes('mileage') || q.includes('efficiency')) {
    return `⛽ **Fuel Efficiency Tips:**\n\n**Current fuel level:** ${data.fuelLevel}%\n\n**Tips to improve mileage:**\n1. Maintain steady speed (40-60 km/h optimal)\n2. Avoid sudden acceleration and braking\n3. Keep tire pressure at recommended levels (30-32 PSI)\n4. Regular engine tuning and air filter cleaning\n5. Avoid idling for extended periods\n6. Use correct gear for your speed\n\n**Your current stats:**\n- Avg speed: ~38 km/h (good range)\n- Tire pressure: ${data.tirePressureFront}/${data.tirePressureRear} PSI ${data.tirePressureFront >= 28 ? '✅' : '⚠️ Low'}\n\n📊 Estimated mileage improvement possible: 10-15% with optimal habits.`;
  }

  if (q.includes('vibration')) {
    return `🔍 **Engine Vibration Analysis:**\n\n**Current vibration level:** ${data.engineVibration} hz\n**Normal range:** 5-30 hz\n\n${data.engineVibration > 40 ? '⚠️ **Elevated vibration detected!**' : '✅ Vibration levels are normal.'}\n\n**Common causes of abnormal vibration:**\n1. Worn engine mounts\n2. Unbalanced wheels\n3. Loose components\n4. Worn chain or sprocket\n5. Internal engine wear\n\n**Recommendation:** ${data.engineVibration > 40 ? 'Schedule a diagnostic check within the week.' : 'No action needed. Continue monitoring.'}`;
  }

  return `🤖 I analyzed your current bike data:\n\n- **Speed:** ${data.speed} km/h\n- **Engine Temp:** ${data.engineTemp}°C\n- **Fuel:** ${data.fuelLevel}%\n- **Battery:** ${data.batteryHealth.toFixed(0)}%\n- **Brakes:** ${data.brakeCondition}%\n\nI can help with diagnostics, maintenance advice, and troubleshooting. Try asking specific questions like "Is it safe to ride?" or "Why is my engine overheating?"`;
}

interface AssistantPageProps {
  bikeData: BikeData;
}

export default function AssistantPage({ bikeData }: AssistantPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: '🤖 **Hello! I\'m your BREAK BREAKER AI Assistant.**\n\nI can analyze your bike\'s sensor data in real-time and provide:\n- Fault diagnosis & troubleshooting\n- Predictive maintenance alerts\n- Safety assessments\n- Riding optimization tips\n\nAsk me anything about your bike!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg, bikeData);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display text-sm tracking-wider">AI DIAGNOSTIC ASSISTANT</h2>
            <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
              <Sparkles size={10} className="text-neon-amber" /> Powered by real-time sensor analysis
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary/20 text-foreground border border-primary/30'
                    : 'glass-card neon-border-blue'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-neon-blue" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="glass-card neon-border-blue rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickQuestions.map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="shrink-0 text-xs font-body px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your bike..."
            className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-all disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
