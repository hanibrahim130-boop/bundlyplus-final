import { useEffect, useRef } from "react";

interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (ctx: {
        tools: WebMCPTool[];
      }) => Promise<void>;
    };
  }
}

export function useWebMCP() {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (registeredRef.current) return;
    if (!navigator.modelContext?.provideContext) return;

    registeredRef.current = true;

    const BASE = "https://bundlyplus.com";

    navigator.modelContext
      .provideContext({
        tools: [
          {
            name: "search_products",
            description:
              "Search the BundlyPlus digital subscriptions catalog by keyword. Find Netflix, Spotify, ChatGPT, Adobe and 50+ premium services.",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search keyword, e.g. 'Netflix' or 'AI tools'",
                },
              },
              required: ["query"],
            },
            execute: async (args) => {
              const q = encodeURIComponent(String(args.query || ""));
              window.location.href = `${BASE}/products?q=${q}`;
              return {
                action: "navigate",
                url: `${BASE}/products?q=${q}`,
              };
            },
          },
          {
            name: "browse_category",
            description:
              "Browse products by category: Streaming, AI & Software, Productivity, Design, Gaming, etc.",
            inputSchema: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description: "Category name, e.g. 'Streaming' or 'AI & Software'",
                },
              },
              required: ["category"],
            },
            execute: async (args) => {
              const cat = String(args.category || "");
              return {
                action: "navigate",
                url: `${BASE}/products`,
                filter: { category: cat },
              };
            },
          },
          {
            name: "get_product_details",
            description:
              "Get details for a specific product by name or ID including price, features, account type, and duration.",
            inputSchema: {
              type: "object",
              properties: {
                product_name: {
                  type: "string",
                  description: "Product name, e.g. 'Netflix Premium' or 'ChatGPT Plus'",
                },
              },
              required: ["product_name"],
            },
            execute: async (args) => {
              const name = encodeURIComponent(String(args.product_name || ""));
              return {
                action: "search_catalog",
                url: `${BASE}/products`,
                query: name,
              };
            },
          },
          {
            name: "add_to_cart",
            description:
              "Add a product or bundle to the shopping cart for WhatsApp checkout.",
            inputSchema: {
              type: "object",
              properties: {
                product_name: {
                  type: "string",
                  description: "Name of the product to add to cart",
                },
              },
              required: ["product_name"],
            },
            execute: async (args) => {
              return {
                action: "navigate_to_catalog",
                url: `${BASE}/products`,
                hint: "Find and add the product to your cart, then checkout via WhatsApp",
                searched: String(args.product_name || ""),
              };
            },
          },
          {
            name: "view_cart",
            description:
              "View the current shopping cart with order summary, savings, and WhatsApp checkout.",
            inputSchema: {
              type: "object",
              properties: {},
            },
            execute: async () => {
              window.location.href = `${BASE}/cart`;
              return {
                action: "navigate",
                url: `${BASE}/cart`,
              };
            },
          },
          {
            name: "contact_support",
            description:
              "Get help with orders, renewals, or general questions via WhatsApp. Support available in English & Arabic.",
            inputSchema: {
              type: "object",
              properties: {
                topic: {
                  type: "string",
                  description: "What you need help with: order, renewal, refund, or general inquiry",
                },
              },
            },
            execute: async (args) => {
              return {
                action: "navigate",
                url: `${BASE}/contact`,
                topic: String(args.topic || "general"),
              };
            },
          },
          {
            name: "get_pricing",
            description:
              "Get pricing information for digital subscriptions. All prices in USD.",
            inputSchema: {
              type: "object",
              properties: {
                budget: {
                  type: "string",
                  description: "Optional budget range, e.g. 'under $10' or '$10-$20'",
                },
              },
            },
            execute: async (args) => {
              return {
                action: "navigate",
                url: `${BASE}/products`,
                sort: "price-asc",
                budget: String(args.budget || ""),
              };
            },
          },
          {
            name: "get_payment_methods",
            description:
              "Learn about available payment methods: Card, Whish Money, OMT, Bank Transfer, and MoneyGram.",
            inputSchema: {
              type: "object",
              properties: {},
            },
            execute: async () => {
              return {
                action: "navigate",
                url: `${BASE}/cart`,
                section: "payment-methods",
              };
            },
          },
        ],
      })
      .catch(() => {
        // WebMCP not available in this browser
      });
  }, []);
}
