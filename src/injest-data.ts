const {
  IngestKnowledgeBaseDocumentsCommand,
} = require("@aws-sdk/client-bedrock-agent");

export const IngestComment = async (bedRockClient, comment) => {
  const input = {
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
    dataSourceId: process.env.DATA_SOURCE_ID,
    documents: [
      {
        metadata: {
          type: "IN_LINE_ATTRIBUTE",
          inlineAttributes: [
            {
              key: "STRING_VALUE",
              value: {
                type: "BOOLEAN" || "NUMBER" || "STRING" || "STRING_LIST",
                numberValue: Number("double"),
                booleanValue: true || false,
                stringValue: "STRING_VALUE",
                stringListValue: ["STRING_VALUE"],
              },
            },
          ],
        },
        content: {
          dataSourceType: "CUSTOM",
          custom: {
            customDocumentIdentifier: {
              id: comment.id,
            },
            sourceType: "IN_LINE",
            inlineContent: {
              type: "BYTE" || "TEXT",
              byteContent: {
                mimeType: "STRING_VALUE",
                data: new Uint8Array(),
              },
              textContent: {
                data: comment.text,
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
