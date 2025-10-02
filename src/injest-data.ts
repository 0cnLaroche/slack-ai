import { BedrockClient } from "@aws-sdk/client-bedrock";
import {
  BedrockAgentClient,
  IngestKnowledgeBaseDocumentsCommand,
  IngestKnowledgeBaseDocumentsCommandInput,
} from "@aws-sdk/client-bedrock-agent";
import { randomUUID } from "crypto";

export const IngestComment = async (
  bedRockClient: BedrockAgentClient,
  comment: string,
) => {
  const input: IngestKnowledgeBaseDocumentsCommandInput = {
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
    dataSourceId: process.env.DATA_SOURCE_ID,
    documents: [
      {
        content: {
          dataSourceType: "CUSTOM",
          custom: {
            customDocumentIdentifier: {
              id: randomUUID(),
            },
            sourceType: "IN_LINE",
            inlineContent: {
              type: "TEXT",
              textContent: {
                data: comment,
              },
            },
          },
        },
      },
    ],
  };
  const command = new IngestKnowledgeBaseDocumentsCommand(input);

  try {
    const response = await bedRockClient.send(command);
    console.info(`Ingestion successful: ${response}`);
  } catch (error) {
    console.error(`Error ingesting document: ${error}`);
  }
};
