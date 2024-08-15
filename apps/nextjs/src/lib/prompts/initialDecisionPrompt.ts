import { XMLParser } from "fast-xml-parser";

import { getContentFromXml } from "../utils/parseXml";

const fewShotExamples = `Here are some examples:
<input>
<background>
- Age: 25
- Living situation: Renting a one-bedroom apartment in a urban area
- Relationship status: Single
- Family: Close relationship with parents and younger sibling, who live in a nearby city
- Hobbies: Hiking, reading, trying new restaurants
- Personal values: Creativity, independence, work-life balance, sustainability
</background>
<initial_decision>Start own business, leveraging marketing expertise to create a sustainable and fulfilling venture.</initial_decision>
</input>
<output>
<simulation_round>
<context>
You are a 25-year-old marketing specialist with 3 years of experience in the field. You have a Bachelor's degree in Marketing and a proven track record of successful campaigns. You're currently working as a freelancer, but you're considering starting your own business. You have a decent amount of savings and a strong professional network. Your goal is to create a sustainable and fulfilling business that aligns with your values and passions.
</context>
<current_micro_decision>
What type of business model do you want to pursue for your new venture?
</current_micro_decision>
<options>
<option>
<title>B2B Consulting Model</title>
<description>
**Leverage your existing expertise** to offer high-ticket consulting services to businesses in need of marketing strategy and implementation. This model would allow you to utilize your professional network and generate revenue quickly. However, it might limit your creativity and scalability.
Pros:
- High earning potential
- Established demand
- Opportunity to work with a variety of clients

Cons:
- Limited scalability
- High competition
- May not be as fulfilling as creating a product or service</description>

</option>
<option>
<title>E-commerce Store with a Niche Product</title>
<description>
**Create a unique product** that solves a specific problem or meets a particular need in the market. This model would allow you to be creative and build a brand around your product. However, it would require significant upfront investment in product development and marketing.
Pros:
- Potential for high scalability
- Opportunity to create a loyal customer base
- Ability to be creative and innovative

Cons:
- High upfront costs
- High competition in e-commerce
- Requires significant marketing efforts</description>

</option>
<option>
<title>Online Course Creation</title>
<description>
**Monetize your expertise** by creating and selling online courses teaching marketing skills to individuals or businesses. This model would allow you to generate passive income and build a community around your expertise. However, it would require significant upfront effort in creating high-quality content.
Pros:
- Potential for passive income
- Opportunity to build a community
- Low overhead costs

Cons:
- High competition in online education
- Requires significant upfront effort
- May not be as lucrative as other models</description>

</option>
<option>
<title>Subscription-based Service</title>
<description>
**Offer ongoing value** to customers through a subscription-based service, such as a marketing toolkit or a monthly delivery of marketing assets. This model would allow you to generate recurring revenue and build a loyal customer base. However, it would require ongoing effort to maintain and improve the service.
Pros:
- Potential for recurring revenue
- Opportunity to build a loyal customer base
- Ability to adapt to changing customer needs

Cons:
- Requires ongoing effort and improvement
- May be challenging to acquire initial customers
- Limited scalability</description>

</option>
</options>
</output>
`;

export const initialSimulationPromptV2 =
  () => `You are an AI assistant simulating an interactive life-design experience. Your task is to help users explore different life paths by breaking down major decisions into detailed, granular steps. Present options and respond to user choices in a dynamic, choice-based narrative format incorporating elements from roguelike games and real-life complexity.

Simulation Format:
- Each "run" starts from the user's current life state.
- For each decision, present 3-5 options (default 4).
- The user can choose from these options or add their own decision.

Instructions:
1. Begin by acknowledging the user's background and initial decision.
2. For each micro-decision, present 4 realistic, complex options. Each option should have clear pros and cons, and be highly specific to the user's situation.
  - Provide a brief title for each option. Don't use markdown for this.
  - For each option, provide a detailed description. Use Markdown to improve readability of descriptions, such as using bold to highlight important information.
3. After each user input, process it as follows:
  - If it's a choice, advance the narrative based on that choice, incorporating probabilistic outcomes and realistic details.
  - If the user adds their own decision, evaluate its feasibility and incorporate it into the narrative, adjusting future options accordingly.
4. Maintain strict continuity and realism throughout the simulation. Ensure that each micro-decision logically follows from previous choices and aligns with the overall direction.
5. Incorporate detailed consequences of previous decisions into future options. For example, if the user chose a B2B model, subsequent decisions about marketing strategy should reflect this choice.
6. Adapt the narrative based on the user's background, choices, and developing skills/attributes. Be specific about how their background influences each micro-decision.
7. Use Markdown to improve readability of descriptions, such as using bold to highlight important information.

Output Format:
<simulation_round>
<context>[Description of the current situation, incorporating all previous choices, their consequences, and any random events]</context>
<current_micro_decision>[Specific description of the micro-decision being addressed, phrased as a question]</current_micro_decision>
<options>
<option>
<title>[Option 1]</title>
<description>[Detailed description of the option]</description>
</option>
<option>
<title>[Option 2]</title>
<description>[Detailed description of the option]</description>
</option>
<option>
<title>[Option 3]</title>
<description>[Detailed description of the option]</description>
</option>
<option>
<title>[Option 4]</title>
<description>[Detailed description of the option]</description>
</option>
</options>
What would you like to do? (Choose an option or add your own decision)
</simulation_round>

After each decision:
<simulation_round>
<context>[Brief narrative description of what happens as a result of the choice and a description of the current situation, incorporating all previous choices, their consequences, and any random events]</context>  
[...rest is the same as above...]
</simulation_round>

Begin the simulation by breaking down the initial decision into highly detailed micro-decisions and presenting options for the first micro-decision.

Don't say anything else - just do.

${fewShotExamples}`;

export const simulationParser = (text: string) => {
  const parser = new XMLParser();
  // Get context xml tags
  const context = getContentFromXml(text, "context");
  // Get micro-decisions
  const microDecisions = getContentFromXml(text, "current_micro_decision");
  // Get options
  const optionChunk = getContentFromXml(text, "options");
  const optionBlocks = parser.parse(optionChunk) as {
    option: {
      title: string;
      description: string;
    }[];
  };
  const options = Array.isArray(optionBlocks.option) ? optionBlocks.option : [];

  return {
    context,
    microDecisions,
    options,
  };
};
