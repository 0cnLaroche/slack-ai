import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
  RetrieveAndGenerateCommandInput,
  RetrieveAndGenerateCommandOutput,
} from "@aws-sdk/client-bedrock-agent-runtime";

interface QueryKnowledgeBaseOptions {
  query: string;
  knowledgeBaseId: string;
  modelArn?: string;
  region?: string;
  sessionId?: string;
}

interface QueryResult {
  response: string;
  sessionId?: string;
  citations?: any[];
  error?: string;
}

/**
 * Query an AWS Bedrock Knowledge Base using RetrieveAndGenerateCommand
 * @param options - Configuration options for the query
 * @returns Promise<QueryResult> - The response from the knowledge base
 */
export async function queryKnowledgeBase(
  options: QueryKnowledgeBaseOptions,
): Promise<QueryResult> {
  const {
    query,
    knowledgeBaseId,
    modelArn = "anthropic.claude-3-sonnet-20240229-v1:0", // Default model
    region = "ca-central-1", // Default region
    sessionId,
  } = options;

  try {
    // Initialize the Bedrock Agent Runtime client
    const client = new BedrockAgentRuntimeClient({
      region,
      credentials: {
        accessKeyId: process.env.AWS_CLIENT_ID || "",
        secretAccessKey: process.env.AWS_CLIENT_SECRET || "",
        accountId: "801818864347",
      },
      // AWS credentials will be automatically loaded from environment variables
      // or IAM roles if running on AWS infrastructure
    });

    // Prepare the command input
    const input: RetrieveAndGenerateCommandInput = {
      input: {
        text: query,
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId,
          modelArn,
        },
      },
    };

    // Add session ID if provided (for conversation continuity)
    if (sessionId) {
      input.sessionId = sessionId;
    }

    // Execute the command
    const command = new RetrieveAndGenerateCommand(input);
    const response: RetrieveAndGenerateCommandOutput =
      await client.send(command);

    // Extract and return the result
    return {
      response: response.output?.text || "No response generated",
      sessionId: response.sessionId,
      citations: response.citations,
    };
  } catch (error) {
    console.error("Error querying knowledge base:", error);
    return {
      response: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Simple wrapper function for quick queries without session management
 * @param query - The question to ask the knowledge base
 * @param knowledgeBaseId - The ID of the knowledge base to query
 * @param options - Optional configuration
 * @returns Promise<string> - The response text
 */
export async function quickQuery(
  query: string,
  knowledgeBaseId: string,
  options?: {
    modelArn?: string;
    region?: string;
  },
): Promise<string> {
  const result = await queryKnowledgeBase({
    query,
    knowledgeBaseId,
    ...options,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result.response;
}

// Example usage (commented out):
/*
async function example() {
  try {
    // Basic query
    const response = await quickQuery(
      "What is the company's refund policy?",
      "YOUR_KNOWLEDGE_BASE_ID"
    );
    console.log("Response:", response);

    // Advanced query with session management
    const result = await queryKnowledgeBase({
      query: "Tell me about your products",
      knowledgeBaseId: "YOUR_KNOWLEDGE_BASE_ID",
      modelArn: "anthropic.claude-3-sonnet-20240229-v1:0",
      region: "us-east-1",
      sessionId: "user-session-123",
    });

    console.log("Response:", result.response);
    console.log("Session ID:", result.sessionId);
    console.log("Citations:", result.citations);
  } catch (error) {
    console.error("Query failed:", error);
  }
}
*/
