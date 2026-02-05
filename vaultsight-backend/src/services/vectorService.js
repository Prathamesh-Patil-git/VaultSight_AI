const Threat = require('../models/Threat');
const { generateEmbedding } = require('./embeddingService');
const winston = require('winston');

const searchSimilarThreats = async (queryVector, limit = 5, riskLevelFilter = null) => {
  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: "threat_vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 50,
          limit: limit,
          ...(riskLevelFilter && { filter: { riskLevel: { $eq: riskLevelFilter } } })
        }
      },
      {
        $addFields: {
          similarityScore: { $meta: "vectorSearchScore" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "affectedUserId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmpty: true } }
    ];

    return await Threat.aggregate(pipeline);
  } catch (error) {
    winston.error(`Vector search error: ${error.message}. Ensure threat_vector_index is configured in MongoDB Atlas.`);
    
    // Fallback: simple keyword search or empty results if vector search fails
    // In production grade, we should alert that vector search is offline
    return [];
  }
};

const findSimilarToTransaction = async (transactionDescription) => {
  try {
    const embedding = await generateEmbedding(transactionDescription);
    if (!embedding) return [];
    
    return await searchSimilarThreats(embedding, 3);
  } catch (error) {
    winston.error(`findSimilarToTransaction error: ${error.message}`);
    return [];
  }
};

module.exports = { searchSimilarThreats, findSimilarToTransaction };

