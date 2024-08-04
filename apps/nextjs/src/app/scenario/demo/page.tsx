"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { motion } from "framer-motion";

export default function Chat() {
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>(
    [],
  );
  const { messages, input, handleInputChange, handleSubmit, append } =
    useChat();
  const effectRan = useRef(false);
  useEffect(() => {
    async function initializeScenario() {
      await append({
        role: "user",
        content: `Start an interactive playable scenario to help me visualize potential futuristic episodes. Keep your responses brief and give me multiple choice options after you respond (starting with "OPTIONS:") so I can "progress" the story 

<background>
Background:
- 28 years old, living in Brooklyn, NY with girlfriend Jackie and 3 cats
- Founder of Playground Education, an AI-powered education tools startup
- Previous experience: AI engineer, software engineer, data scientist, designer (10 years)
- Attended UT Austin for undergrad but dropped out halfway through

Personality Traits:
Ambitious, Analytical, Creative, Empathetic, Introverted, Adaptable, Optimistic, Confident, Spontaneous, Independent

Interests and Hobbies:
Reading, skateboarding, photography, fashion, art, traveling, playing with cats

Current Work:
- Solo founder of Playground Education (2 years)
- Manages all aspects: technical, design, product, go-to-market, fundraising
- Current focus: wanderer.space, a tool for mapping potential futures

Core Values and Beliefs:
- "Interest begets intelligence"
- Optimize for tacit knowledge, not explicit knowledge
- Real educational opportunities are outside the classroom
- Focus on building learner agency
- Education is a process of self-discovery, not information transfer
- Life motto: "A positive attitude is my key to success in life"

Life Evaluation:
1. Work Satisfaction: 4.5/5 - Extremely fulfilled, slight improvement possible by having amazing people to work with
2. Play/Leisure: 2.5/5 - Limited time for hobbies due to startup focus, but accepting of this trade-off
3. Love/Relationships: 5/5 - Strong, improving 8-year relationship with girlfriend Jackie
4. Health (Physical, Mental, Spiritual): 5/5 - Excellent overall health and well-being
</background>
<scenario>
<name>Tokyo Tech Trailblazer</name>
<description>You successfully adapt to life in Tokyo, leveraging the change of pace to fuel creativity in your work. Your startup gains traction in the Asian market, unexpectedly opening new opportunities. Jackie finds work teaching English, and you both embrace the local culture. The cats adjust well to their new environment.</description>
</scenario>

For example:

It's 7 AM, and you wake up in your cozy apartment in Tokyo. The sound of the busy city is already filtering through your window. Jackie is still asleep, and your cats are curled up at the foot of the bed.
What's your first move of the day?

OPTIONS:
A) Check your phone for messages from Western clients
B) Meditate on the balcony
C) Make a traditional Japanese breakfast`,
      });
    }
    if (!effectRan.current) {
      setTimeout(() => {
        void initializeScenario();
      }, 1000);
      return () => {
        effectRan.current = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      // Parse out OPTIONS: and the options that follow
      if (messages[1]?.content.includes("OPTIONS:")) {
        const options = messages[1]?.content.split("OPTIONS:")[1]?.trim();
        if (options) {
          const optionsArray = options
            .split("\n")
            .map((option) => option.trim());
          setMultipleChoiceOptions(optionsArray);
        }
      }
    }
  }, [messages]);
  return (
    <div className="relative h-screen w-full">
      <motion.img
        src="/tokyo-travel.webp"
        alt="Tokyo"
        className="h-full w-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
        {messages.slice(1).map((m) => (
          <div className="flex flex-col gap-4" key={m.id}>
            <div className="whitespace-pre-wrap text-lg">
              {m.content.split("OPTIONS:")[0]?.trim()}
            </div>
            <div className="flex flex-wrap gap-2">
              {multipleChoiceOptions.map((option, index) => (
                <button
                  key={index}
                  className="rounded-md border border-white bg-transparent px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-white hover:text-black"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
