const { v4: uuidv4 } = require('uuid');

/**
 * 规则推理增强模块
 */
class RuleReasoner {
  constructor(config = {}) {
    this.ruleTypes = config.ruleTypes || ['transitive', 'symmetric', 'reflexive'];
    this.minConfidence = config.minConfidence || 0.9;
    this.maxRules = config.maxRules || 1000;
    this.rules = [];
    this.learnedRules = [];
  }

  /**
   * 应用规则
   * @param {Array} facts 事实列表
   * @param {Array} rules 规则列表
   * @returns {Array} 推理结果
   */
  applyRules(facts, rules = null) {
    const targetRules = rules || this.rules;
    const results = [];

    for (const rule of targetRules) {
      const ruleResults = this._applyRule(facts, rule);
      results.push({
        rule: rule,
        results: ruleResults
      });
    }

    return results;
  }

  /**
   * 应用单个规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyRule(facts, rule) {
    const results = [];

    switch (rule.type) {
      case 'transitive':
        results.push(...this._applyTransitiveRule(facts, rule));
        break;
      case 'symmetric':
        results.push(...this._applySymmetricRule(facts, rule));
        break;
      case 'reflexive':
        results.push(...this._applyReflexiveRule(facts, rule));
        break;
      case 'inverse':
        results.push(...this._applyInverseRule(facts, rule));
        break;
      case 'composition':
        results.push(...this._applyCompositionRule(facts, rule));
        break;
      case 'general':
        results.push(...this._applyGeneralRule(facts, rule));
        break;
    }

    return results;
  }

  /**
   * 应用传递性规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyTransitiveRule(facts, rule) {
    const results = [];

    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.tail === fact2.head && fact1.relation === fact2.relation) {
          results.push({
            head: fact1.head,
            relation: fact1.relation,
            tail: fact2.tail,
            confidence: (fact1.confidence || 1) * (fact2.confidence || 1),
            rule: rule.name || 'transitive'
          });
        }
      }
    }

    return results;
  }

  /**
   * 应用对称性规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applySymmetricRule(facts, rule) {
    const results = [];

    for (const fact of facts) {
      if (rule.relations && !rule.relations.includes(fact.relation)) {
        continue;
      }

      results.push({
        head: fact.tail,
        relation: rule.inverseRelation || `inverse_${fact.relation}`,
        tail: fact.head,
        confidence: fact.confidence || 1,
        rule: rule.name || 'symmetric'
      });
    }

    return results;
  }

  /**
   * 应用自反性规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyReflexiveRule(facts, rule) {
    const results = [];
    const entities = new Set();

    for (const fact of facts) {
      entities.add(fact.head);
      entities.add(fact.tail);
    }

    for (const entity of entities) {
      results.push({
        head: entity,
        relation: rule.relation || 'self',
        tail: entity,
        confidence: 1.0,
        rule: rule.name || 'reflexive'
      });
    }

    return results;
  }

  /**
   * 应用逆关系规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyInverseRule(facts, rule) {
    const results = [];

    for (const fact of facts) {
      if (fact.relation === rule.relation) {
        results.push({
          head: fact.tail,
          relation: rule.inverseRelation,
          tail: fact.head,
          confidence: fact.confidence || 1,
          rule: rule.name || 'inverse'
        });
      }
    }

    return results;
  }

  /**
   * 应用组合规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyCompositionRule(facts, rule) {
    const results = [];

    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.tail === fact2.head && 
            fact1.relation === rule.relation1 && 
            fact2.relation === rule.relation2) {
          results.push({
            head: fact1.head,
            relation: rule.composedRelation,
            tail: fact2.tail,
            confidence: (fact1.confidence || 1) * (fact2.confidence || 1),
            rule: rule.name || 'composition'
          });
        }
      }
    }

    return results;
  }

  /**
   * 应用通用规则
   * @param {Array} facts 事实列表
   * @param {Object} rule 规则
   * @returns {Array} 推理结果
   * @private
   */
  _applyGeneralRule(facts, rule) {
    const results = [];

    // 简化的规则应用，实际应该使用更复杂的规则引擎
    for (const fact of facts) {
      if (this._matchPattern(fact, rule.pattern)) {
        const inferredFact = this._applyConclusion(fact, rule.conclusion);
        if (inferredFact) {
          results.push({
            ...inferredFact,
            confidence: fact.confidence || 1 * (rule.confidence || 1),
            rule: rule.name || 'general'
          });
        }
      }
    }

    return results;
  }

  /**
   * 匹配规则模式
   * @param {Object} fact 事实
   * @param {Object} pattern 模式
   * @returns {boolean} 是否匹配
   * @private
   */
  _matchPattern(fact, pattern) {
    if (pattern.head && pattern.head !== fact.head) return false;
    if (pattern.relation && pattern.relation !== fact.relation) return false;
    if (pattern.tail && pattern.tail !== fact.tail) return false;
    return true;
  }

  /**
   * 应用规则结论
   * @param {Object} fact 事实
   * @param {Object} conclusion 结论
   * @returns {Object} 推断的事实
   * @private
   */
  _applyConclusion(fact, conclusion) {
    return {
      head: conclusion.head || fact.head,
      relation: conclusion.relation,
      tail: conclusion.tail || fact.tail
    };
  }

  /**
   * 规则学习
   * @param {Array} facts 事实列表
   * @param {Object} options 选项
   * @returns {Array} 学习到的规则
   */
  learnRules(facts, options = {}) {
    const maxRuleLength = options.maxRuleLength || 3;
    const minSupport = options.minSupport || 2;
    const minConfidence = options.minConfidence || this.minConfidence;

    console.log('开始规则学习...');

    // 学习传递性规则
    const transitiveRules = this._learnTransitiveRules(facts, minSupport, minConfidence);
    
    // 学习对称性规则
    const symmetricRules = this._learnSymmetricRules(facts, minSupport, minConfidence);
    
    // 学习逆关系规则
    const inverseRules = this._learnInverseRules(facts, minSupport, minConfidence);
    
    // 学习组合规则
    const compositionRules = this._learnCompositionRules(facts, minSupport, minConfidence);

    const learnedRules = [
      ...transitiveRules,
      ...symmetricRules,
      ...inverseRules,
      ...compositionRules
    ];

    this.learnedRules = learnedRules;
    console.log(`学习完成，发现 ${learnedRules.length} 条规则`);

    return learnedRules;
  }

  /**
   * 学习传递性规则
   * @param {Array} facts 事实列表
   * @param {number} minSupport 最小支持度
   * @param {number} minConfidence 最小置信度
   * @returns {Array} 学习到的规则
   * @private
   */
  _learnTransitiveRules(facts, minSupport, minConfidence) {
    const rules = [];
    const relationSupport = new Map();

    // 计算关系的支持度
    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.tail === fact2.head && fact1.relation === fact2.relation) {
          const key = fact1.relation;
          const count = relationSupport.get(key) || 0;
          relationSupport.set(key, count + 1);
        }
      }
    }

    // 生成传递性规则
    for (const [relation, support] of relationSupport.entries()) {
      if (support >= minSupport) {
        rules.push({
          type: 'transitive',
          name: `transitive_${relation}`,
          relation: relation,
          support: support,
          confidence: minConfidence
        });
      }
    }

    return rules;
  }

  /**
   * 学习对称性规则
   * @param {Array} facts 事实列表
   * @param {number} minSupport 最小支持度
   * @param {number} minConfidence 最小置信度
   * @returns {Array} 学习到的规则
   * @private
   */
  _learnSymmetricRules(facts, minSupport, minConfidence) {
    const rules = [];
    const relationPairs = new Map();

    // 计算关系对的支持度
    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.head === fact2.tail && fact1.tail === fact2.head) {
          const key = [fact1.relation, fact2.relation].sort().join('->');
          const count = relationPairs.get(key) || 0;
          relationPairs.set(key, count + 1);
        }
      }
    }

    // 生成对称性规则
    for (const [key, support] of relationPairs.entries()) {
      if (support >= minSupport) {
        const [rel1, rel2] = key.split('->');
        rules.push({
          type: 'symmetric',
          name: `symmetric_${rel1}`,
          relations: [rel1],
          inverseRelation: rel2,
          support: support,
          confidence: minConfidence
        });
      }
    }

    return rules;
  }

  /**
   * 学习逆关系规则
   * @param {Array} facts 事实列表
   * @param {number} minSupport 最小支持度
   * @param {number} minConfidence 最小置信度
   * @returns {Array} 学习到的规则
   * @private
   */
  _learnInverseRules(facts, minSupport, minConfidence) {
    const rules = [];
    const inversePairs = new Map();

    // 计算逆关系对的支持度
    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.head === fact2.tail && fact1.tail === fact2.head) {
          const key = `${fact1.relation}->${fact2.relation}`;
          const count = inversePairs.get(key) || 0;
          inversePairs.set(key, count + 1);
        }
      }
    }

    // 生成逆关系规则
    for (const [key, support] of inversePairs.entries()) {
      if (support >= minSupport) {
        const [relation, inverseRelation] = key.split('->');
        rules.push({
          type: 'inverse',
          name: `inverse_${relation}`,
          relation: relation,
          inverseRelation: inverseRelation,
          support: support,
          confidence: minConfidence
        });
      }
    }

    return rules;
  }

  /**
   * 学习组合规则
   * @param {Array} facts 事实列表
   * @param {number} minSupport 最小支持度
   * @param {number} minConfidence 最小置信度
   * @returns {Array} 学习到的规则
   * @private
   */
  _learnCompositionRules(facts, minSupport, minConfidence) {
    const rules = [];
    const compositionSupport = new Map();

    // 计算组合关系的支持度
    for (const fact1 of facts) {
      for (const fact2 of facts) {
        if (fact1.tail === fact2.head) {
          const key = `${fact1.relation}->${fact2.relation}`;
          const count = compositionSupport.get(key) || 0;
          compositionSupport.set(key, count + 1);
        }
      }
    }

    // 生成组合规则
    for (const [key, support] of compositionSupport.entries()) {
      if (support >= minSupport) {
        const [relation1, relation2] = key.split('->');
        rules.push({
          type: 'composition',
          name: `composition_${relation1}_${relation2}`,
          relation1: relation1,
          relation2: relation2,
          composedRelation: `${relation1}_${relation2}`,
          support: support,
          confidence: minConfidence
        });
      }
    }

    return rules;
  }

  /**
   * 组合推理
   * @param {Array} queries 查询列表
   * @param {Array} facts 事实列表
   * @returns {Array} 推理结果
   */
  async compositionalReasoning(queries, facts) {
    const results = [];

    for (const query of queries) {
      let queryResult;

      switch (query.type) {
        case 'path':
          queryResult = await this._reasonPath(query, facts);
          break;
        case 'relation':
          queryResult = await this._reasonRelation(query, facts);
          break;
        case 'rule':
          queryResult = this.applyRules(facts, query.rules);
          break;
        default:
          queryResult = [];
      }

      results.push({
        query: query,
        result: queryResult
      });
    }

    return results;
  }

  /**
   * 路径推理
   * @param {Object} query 查询
   * @param {Array} facts 事实列表
   * @returns {Array} 推理结果
   * @private
   */
  async _reasonPath(query, facts) {
    // 简化的路径推理
    const paths = [];
    const visited = new Set();

    const dfs = (current, target, path, depth) => {
      if (depth > 5) return;
      if (current === target) {
        paths.push([...path]);
        return;
      }

      visited.add(current);
      for (const fact of facts) {
        if (fact.head === current && !visited.has(fact.tail)) {
          path.push({ node: fact.tail, relation: fact.relation });
          dfs(fact.tail, target, path, depth + 1);
          path.pop();
        }
      }
      visited.delete(current);
    };

    dfs(query.source, query.target, [{ node: query.source }], 0);
    return paths;
  }

  /**
   * 关系推理
   * @param {Object} query 查询
   * @param {Array} facts 事实列表
   * @returns {Array} 推理结果
   * @private
   */
  async _reasonRelation(query, facts) {
    const directRelations = facts.filter(fact => 
      (fact.head === query.node1 && fact.tail === query.node2) ||
      (fact.head === query.node2 && fact.tail === query.node1)
    );

    // 间接关系
    const indirectRelations = [];
    for (const fact1 of facts) {
      if (fact1.head === query.node1) {
        for (const fact2 of facts) {
          if (fact2.head === fact1.tail && fact2.tail === query.node2) {
            indirectRelations.push({
              path: [query.node1, fact1.tail, query.node2],
              relations: [fact1.relation, fact2.relation],
              confidence: (fact1.confidence || 1) * (fact2.confidence || 1)
            });
          }
        }
      }
    }

    return {
      direct: directRelations,
      indirect: indirectRelations
    };
  }

  /**
   * 规则评估
   * @param {Array} rules 规则列表
   * @param {Array} testFacts 测试事实
   * @returns {Array} 评估结果
   */
  evaluateRules(rules, testFacts) {
    const evaluations = [];

    for (const rule of rules) {
      const results = this._applyRule(testFacts, rule);
      const correct = results.filter(result => 
        testFacts.some(fact => 
          fact.head === result.head && 
          fact.relation === result.relation && 
          fact.tail === result.tail
        )
      );

      const precision = results.length > 0 ? correct.length / results.length : 0;
      const recall = testFacts.length > 0 ? correct.length / testFacts.length : 0;
      const f1 = 2 * (precision * recall) / (precision + recall) || 0;

      evaluations.push({
        rule: rule,
        precision: precision,
        recall: recall,
        f1: f1,
        correct: correct.length,
        total: results.length
      });
    }

    return evaluations;
  }

  /**
   * 添加规则
   * @param {Object} rule 规则
   */
  addRule(rule) {
    if (this.rules.length < this.maxRules) {
      this.rules.push(rule);
    }
  }

  /**
   * 移除规则
   * @param {string} ruleName 规则名称
   */
  removeRule(ruleName) {
    this.rules = this.rules.filter(rule => rule.name !== ruleName);
  }

  /**
   * 获取规则
   * @returns {Array} 规则列表
   */
  getRules() {
    return this.rules;
  }

  /**
   * 获取学习到的规则
   * @returns {Array} 学习到的规则
   */
  getLearnedRules() {
    return this.learnedRules;
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.rules = [];
    this.learnedRules = [];
  }
}

/**
 * 规则推理管理器
 */
class RuleReasonerManager {
  constructor() {
    this.reasoners = new Map();
  }

  /**
   * 创建规则推理器
   * @param {Object} config 配置
   * @returns {Object} 推理器
   */
  createReasoner(config = {}) {
    const reasoner = new RuleReasoner(config);
    const id = uuidv4();
    this.reasoners.set(id, reasoner);
    return { id, reasoner };
  }

  /**
   * 获取规则推理器
   * @param {string} id 推理器ID
   * @returns {RuleReasoner} 推理器
   */
  getReasoner(id) {
    return this.reasoners.get(id);
  }

  /**
   * 删除规则推理器
   * @param {string} id 推理器ID
   */
  deleteReasoner(id) {
    this.reasoners.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    for (const reasoner of this.reasoners.values()) {
      reasoner.cleanup();
    }
    this.reasoners.clear();
  }
}

const ruleReasonerManager = new RuleReasonerManager();

module.exports = {
  RuleReasoner,
  RuleReasonerManager,
  ruleReasonerManager
};
