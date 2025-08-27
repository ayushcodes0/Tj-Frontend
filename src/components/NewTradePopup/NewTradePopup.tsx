import React, { useState, useEffect, useCallback } from 'react';
import Styles from "./NewTradePopup.module.css";
import { RiResetLeftLine } from "react-icons/ri";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa6"; // Added FaArrowRight for Next button
import {
  fetchOptions,
  addOption,
  saveTrade,
} from '../../services/apiService'; 
import type { TradeFormData } from '../../types/trade';
import { useCustomToast } from '../../hooks/useCustomToast'; 
import { useTrades } from "../../hooks/useTrade";
import type { Trade } from '../../context/TradeContext';

interface NewTradePopupProps {
  onClose: () => void;
  tradeToEdit?: Trade | null;
}

interface Option {
  _id: string;
  name: string;
}

const initialFormData: TradeFormData = {
  symbol: '',
  date: '',
  quantity: null,
  total_amount: 0,
  entry_price: null,
  exit_price: null,
  direction: 'Long',
  stop_loss: null,
  target: null,
  strategy: '',
  trade_analysis: '',
  outcome_summary: '',
  rules_followed: [],
  pnl_amount: 0,
  pnl_percentage: 0,
  holding_period_minutes: null,
  tags: [],
  psychology: {
    entry_confidence_level: 5,
    satisfaction_rating: 5,
    emotional_state: '',
    mistakes_made: [],
    lessons_learned: ''
  }
};

const getRangeProgressStyle = (value: number, min: number, max: number) => {
  const progress = ((value - min) / (max - min)) * 100;
  return { '--progress-percent': `${progress}%` } as React.CSSProperties;
};

const NewTradePopup: React.FC<NewTradePopupProps> = ({ onClose, tradeToEdit }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'psychology'>('general');
  const [formData, setFormData] = useState<TradeFormData>(initialFormData);
  const { fetchTrades, updateTrade } = useTrades();
  const toast = useCustomToast();

  const [strategies, setStrategies] = useState<Option[]>([]);
  const [outcomeSummaries, setOutcomeSummaries] = useState<Option[]>([]);
  const [rulesOptions, setRulesOptions] = useState<Option[]>([]);
  const [emotionalStates, setEmotionalStates] = useState<Option[]>([]);
  
  const [newCustomStrategyName, setNewCustomStrategyName] = useState('');
  const [newCustomRuleName, setNewCustomRuleName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newMistake, setNewMistake] = useState('');

  useEffect(() => {
    if (tradeToEdit) {
      const populatedFormData: TradeFormData = {
        ...initialFormData,
        ...tradeToEdit,
        strategy: typeof tradeToEdit.strategy === 'object' ? tradeToEdit.strategy._id : '',
        outcome_summary: typeof tradeToEdit.outcome_summary === 'object' ? tradeToEdit.outcome_summary._id : '',
        rules_followed: tradeToEdit.rules_followed?.map(rule => typeof rule === 'object' ? rule._id : '') || [],
        psychology: {
          ...initialFormData.psychology,
          ...tradeToEdit.psychology,
          emotional_state: typeof tradeToEdit.psychology?.emotional_state === 'object' ? tradeToEdit.psychology.emotional_state._id : '',
          mistakes_made: tradeToEdit.psychology?.mistakes_made || [],
        },
        date: tradeToEdit.date ? new Date(tradeToEdit.date).toISOString().slice(0, 16) : '',
        quantity: tradeToEdit.quantity || null,
        entry_price: tradeToEdit.entry_price || null,
        exit_price: tradeToEdit.exit_price || null,
        stop_loss: tradeToEdit.stop_loss || null,
        target: tradeToEdit.target || null,
        holding_period_minutes: tradeToEdit.holding_period_minutes || null,
        tags: tradeToEdit.tags || []
      };
      setFormData(populatedFormData);
    } else {
      setFormData(initialFormData);
    }
  }, [tradeToEdit]);

  const handleReset = () => {
    setFormData(initialFormData);
    setNewCustomStrategyName('');
    setNewCustomRuleName('');
    setNewTag('');
    setNewMistake('');
    setActiveTab('general');
    toast.showInfoToast("Reset successful. You can start again.");
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [strategiesData, outcomesData, rulesData, emotionsData] = await Promise.all([
          fetchOptions('Strategy'),
          fetchOptions('OutcomeSummary'),
          fetchOptions('RulesFollowed'),
          fetchOptions('EmotionalState')
        ]);
        setStrategies(Array.isArray(strategiesData) ? strategiesData : []);
        setOutcomeSummaries(Array.isArray(outcomesData) ? outcomesData : []);
        setRulesOptions(Array.isArray(rulesData) ? rulesData : []);
        setEmotionalStates(Array.isArray(emotionsData) ? emotionsData : []);
      } catch (error: unknown) {
        toast.handleApiError(error);
      }
    };
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { quantity, entry_price, exit_price, direction } = formData;
  useEffect(() => {
    const numQuantity = quantity ?? 0;
    const numEntryPrice = entry_price ?? 0;
    const numExitPrice = exit_price ?? 0;
    const newTotalAmount = numQuantity * numEntryPrice;
    let newPnlAmount = 0;
    if (numQuantity > 0 && numEntryPrice > 0 && numExitPrice > 0) {
      newPnlAmount = direction === 'Long'
        ? (numExitPrice - numEntryPrice) * numQuantity
        : (numEntryPrice - numExitPrice) * numQuantity;
    }
    const newPnlPercentage = newTotalAmount !== 0 ? (newPnlAmount / newTotalAmount) * 100 : 0;
    setFormData(prev => ({
      ...prev,
      total_amount: parseFloat(newTotalAmount.toFixed(2)),
      pnl_amount: parseFloat(newPnlAmount.toFixed(2)),
      pnl_percentage: parseFloat(newPnlPercentage.toFixed(2)),
    }));
  }, [quantity, entry_price, exit_price, direction]);

  const handleUpdateField = useCallback(
    <K extends keyof TradeFormData>(field: K, value: TradeFormData[K]) => {
      const finalValue = (field === 'symbol' && typeof value === 'string')
        ? value.toUpperCase()
        : value;
      setFormData(prev => ({ ...prev, [field]: finalValue }));
    },
    []
  );

  const handlePsychologyChange = useCallback(
    (value: Partial<TradeFormData['psychology']>) => {
      setFormData(prev => ({
        ...prev,
        psychology: { ...prev.psychology, ...value },
      }));
    },
    []
  );

  const handleNumberInputChange = (
    field: 'quantity' | 'entry_price' | 'exit_price' | 'stop_loss' | 'target' | 'holding_period_minutes',
    value: string
  ) => {
    handleUpdateField(field, value === '' ? null : Number(value));
  };

  const handleMultiSelect = useCallback(
    (ruleId: string) => {
      const currentValues = formData.rules_followed;
      const newValues = currentValues.includes(ruleId)
        ? currentValues.filter(id => id !== ruleId)
        : [...currentValues, ruleId];
      handleUpdateField('rules_followed', newValues);
    },
    [formData.rules_followed, handleUpdateField]
  );

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleUpdateField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
      toast.showSuccessToast(`Tag "${newTag.trim()}" added!`);
    }
  }, [newTag, formData.tags, handleUpdateField, toast]);

  const removeTag = useCallback(
    (tag: string) => {
      handleUpdateField('tags', formData.tags.filter(t => t !== tag));
      toast.showInfoToast(`Tag "${tag}" removed.`);
    },
    [formData.tags, handleUpdateField, toast]
  );

  const addMistake = useCallback(() => {
    if (
      newMistake.trim() &&
      !formData.psychology.mistakes_made.includes(newMistake.trim())
    ) {
      handlePsychologyChange({
        mistakes_made: [
          ...formData.psychology.mistakes_made,
          newMistake.trim(),
        ],
      });
      setNewMistake('');
      toast.showSuccessToast(`Mistake "${newMistake.trim()}" added.`);
    }
  }, [newMistake, formData.psychology.mistakes_made, handlePsychologyChange, toast]);

  const removeMistake = useCallback(
    (mistake: string) => {
      handlePsychologyChange({
        mistakes_made: formData.psychology.mistakes_made.filter(m => m !== mistake),
      });
      toast.showInfoToast(`Mistake "${mistake}" removed.`);
    },
    [formData.psychology.mistakes_made, handlePsychologyChange, toast]
  );

  const handleAddCustomStrategy = async () => {
    if (!newCustomStrategyName.trim()) {
      toast.handleValidationError("Strategy name", "required");
      return;
    }
    try {
      const newOption = await addOption('Strategy', newCustomStrategyName.trim());
      setStrategies(prev => [...prev, newOption]);
      handleUpdateField('strategy', newOption._id);
      setNewCustomStrategyName('');
      toast.showSuccessToast(`Strategy "${newOption.name}" added!`);
    } catch (error: unknown) {
      toast.handleApiError(error);
    }
  };

  const handleAddCustomRule = async () => {
    if (!newCustomRuleName.trim()) {
      toast.handleValidationError("Rule name", "required");
      return;
    }
    try {
      const newOption = await addOption('RulesFollowed', newCustomRuleName.trim());
      setRulesOptions(prev => [...prev, newOption]);
      handleMultiSelect(newOption._id);
      setNewCustomRuleName('');
      toast.showSuccessToast(`Rule "${newOption.name}" added!`);
    } catch (error: unknown) {
      toast.handleApiError(error);
    }
  };

  // Helper: Convert the form data to the backend-compatible format
  const convertFormDataToTradeData = (formData: TradeFormData): Partial<Trade> => {
    return {
      ...formData,
      quantity: formData.quantity ?? undefined,
      entry_price: formData.entry_price ?? undefined,
      exit_price: formData.exit_price ?? undefined,
      stop_loss: formData.stop_loss ?? undefined,
      target: formData.target ?? undefined,
      holding_period_minutes: formData.holding_period_minutes ?? undefined,
      strategy: formData.strategy ? { _id: formData.strategy, name: '' } : undefined,
      outcome_summary: formData.outcome_summary ? { _id: formData.outcome_summary, name: '' } : undefined,
      rules_followed: formData.rules_followed
        ? formData.rules_followed.map(id => ({ _id: id, name: '' }))
        : [],
      psychology: formData.psychology
        ? {
            ...formData.psychology,
            emotional_state: formData.psychology.emotional_state
              ? { _id: formData.psychology.emotional_state, name: '' }
              : undefined,
          }
        : undefined,
      tags: formData.tags || [],
    };
  };

  // Validate only required fields for General tab
  const validateGeneralTab = (): boolean => {
    if (!formData.symbol.trim()) {
      toast.handleValidationError("Symbol", "required");
      return false;
    }
    if (!formData.date) {
      toast.handleValidationError("Date", "required");
      return false;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      toast.showErrorToast("Quantity must be greater than 0.");
      return false;
    }
    if (!formData.direction || !["Long", "Short"].includes(formData.direction)) {
      toast.showErrorToast("Trade direction must be selected.");
      return false;
    }
    if (!formData.entry_price || formData.entry_price <= 0) {
      toast.showErrorToast("Entry price must be greater than 0.");
      return false;
    }
    if (!formData.strategy) {
      toast.handleValidationError("Strategy", "required");
      return false;
    }
    if (!formData.outcome_summary) {
      toast.handleValidationError("Outcome summary", "required");
      return false;
    }
    if (formData.rules_followed.length === 0) {
      toast.showErrorToast("Please select at least one rule followed.");
      return false;
    }
    return true;
  };

  // Complete form validation (for submission)
  const validateForm = (): boolean => {
    if (!validateGeneralTab()) return false;
    
    // Psychology tab required fields
    if (!formData.psychology.entry_confidence_level ||
        formData.psychology.entry_confidence_level < 1 ||
        formData.psychology.entry_confidence_level > 10) {
      toast.showErrorToast("Entry confidence must be between 1-10.");
      return false;
    }
    if (!formData.psychology.satisfaction_rating ||
        formData.psychology.satisfaction_rating < 1 ||
        formData.psychology.satisfaction_rating > 10) {
      toast.showErrorToast("Satisfaction rating must be between 1-10.");
      return false;
    }
    if (!formData.psychology.emotional_state) {
      toast.handleValidationError("Emotional state", "required");
      return false;
    }
    return true;
  };

  // Handle Next button click (from General to Psychology)
  const handleNext = () => {
    if (validateGeneralTab()) {
      setActiveTab('psychology');
      toast.showInfoToast("Great! Now fill in the psychology details.");
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (tradeToEdit?._id) {
        const tradeData = convertFormDataToTradeData(formData);
        await updateTrade(tradeToEdit._id, tradeData);
        toast.showSuccessToast('Trade updated successfully!');
      } else {
        await saveTrade(formData);
        toast.showSuccessToast('Trade saved successfully!');
      }
      await fetchTrades();
      onClose();
    } catch (error: unknown) {
      toast.handleApiError(error);
    }
  };

  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.newTradePopup} onClick={e => e.stopPropagation()}>
        <div className={Styles.header}>
          <h2>{tradeToEdit ? "Edit Trade" : "New Trade Entry"}</h2>
          <button className={Styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={Styles.tabNavigation}>
          <button
            type="button"
            className={`${Styles.tabBtn} ${activeTab === "general" ? Styles.active : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={`${Styles.tabBtn} ${activeTab === "psychology" ? Styles.active : ""}`}
            onClick={() => setActiveTab("psychology")}
          >
            Psychology
          </button>
        </div>
        <form className={Styles.form}>
          {activeTab === "general" && (
            <div className={Styles.formContent}>
              <div className={Styles.section}>
                <h3>Trade Details</h3>
                <div className={`${Styles.formGrid} ${Styles.tradeDetailsGrid}`}>
                  <div className={Styles.formGroup}>
                    <label>
                      Symbol <span className={Styles.required}>*</span>
                    </label>
                    <input type="text" value={formData.symbol} onChange={e => handleUpdateField("symbol", e.target.value)} required />
                  </div>
                  <div className={Styles.formGroup}>
                    <label htmlFor="tradeDate">
                      Date <span className={Styles.required}>*</span>
                    </label>
                    <input
                      id="tradeDate"
                      type="datetime-local"
                      value={formData.date}
                      onChange={e => handleUpdateField("date", e.target.value)}
                      required
                      className={Styles.dateInput}
                    />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>
                      Quantity <span className={Styles.required}>*</span>
                    </label>
                    <input type="number" value={formData.quantity ?? ""} min={1} onChange={e => handleNumberInputChange("quantity", e.target.value)} required />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>
                      Direction <span className={Styles.required}>*</span>
                    </label>
                    <div className={Styles.directionContainer}>
                      <button
                        type="button"
                        className={`${Styles.directionBtn} ${formData.direction === "Long" ? Styles.active : ""}`}
                        onClick={() => handleUpdateField("direction", "Long")}
                      >
                        <FaArrowUp /> Long
                      </button>
                      <button
                        type="button"
                        className={`${Styles.directionBtn} ${formData.direction === "Short" ? Styles.active : ""}`}
                        onClick={() => handleUpdateField("direction", "Short")}
                      >
                        <FaArrowDown /> Short
                      </button>
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>
                      Entry Price <span className={Styles.required}>*</span>
                    </label>
                    <input type="number" step="0.01" value={formData.entry_price ?? ""} min={0.01} onChange={e => handleNumberInputChange("entry_price", e.target.value)} required />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Exit Price</label>
                    <input type="number" step="0.01" value={formData.exit_price ?? ""} onChange={e => handleNumberInputChange("exit_price", e.target.value)} />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Stop Loss</label>
                    <input type="number" step="0.01" value={formData.stop_loss ?? ""} onChange={e => handleNumberInputChange("stop_loss", e.target.value)} />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Target</label>
                    <input type="number" step="0.01" value={formData.target ?? ""} onChange={e => handleNumberInputChange("target", e.target.value)} />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Total Amount</label>
                    <div className={Styles.calculatedField}>₹{formData.total_amount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className={Styles.section}>
                <h3>Strategy & Analysis</h3>
                <div className={Styles.sectionContent}>
                  <div className={Styles.formGrid}>
                    <div className={Styles.formGroup}>
                      <label>
                        Strategy <span className={Styles.required}>*</span>
                      </label>
                      <select value={formData.strategy} onChange={e => handleUpdateField("strategy", e.target.value)} required>
                        <option value="">Select Strategy</option>
                        {strategies.map(o => (
                          <option key={o._id} value={o._id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                      <div className={Styles.addCustomContainer}>
                        <input
                          type="text"
                          value={newCustomStrategyName}
                          onChange={e => setNewCustomStrategyName(e.target.value)}
                          placeholder="Or add new strategy..."
                          onKeyPress={e =>
                            e.key === "Enter" && (e.preventDefault(), handleAddCustomStrategy())
                          }
                        />
                        <button type="button" onClick={handleAddCustomStrategy}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className={Styles.formGroup}>
                      <label>
                        Outcome <span className={Styles.required}>*</span>
                      </label>
                      <select value={formData.outcome_summary} onChange={e => handleUpdateField("outcome_summary", e.target.value)} required>
                        <option value="">Select Outcome</option>
                        {outcomeSummaries.map(o => (
                          <option key={o._id} value={o._id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Trade Analysis</label>
                    <textarea value={formData.trade_analysis} onChange={e => handleUpdateField("trade_analysis", e.target.value)} rows={4} />
                  </div>
                  <div className={Styles.formGroup}>
                    <label>
                      Rules Followed <span className={Styles.required}>*</span>
                    </label>
                    <div className={Styles.multiSelectContainer}>
                      {rulesOptions.map(o => (
                        <label key={o._id} className={Styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={formData.rules_followed.includes(o._id)}
                            onChange={() => handleMultiSelect(o._id)}
                          />
                          {o.name}
                        </label>
                      ))}
                    </div>
                    <div className={Styles.addCustomContainer}>
                      <input
                        type="text"
                        value={newCustomRuleName}
                        onChange={e => setNewCustomRuleName(e.target.value)}
                        placeholder="Or add new rule..."
                        onKeyPress={e =>
                          e.key === "Enter" && (e.preventDefault(), handleAddCustomRule())
                        }
                      />
                      <button type="button" onClick={handleAddCustomRule}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={Styles.section}>
                <h3>Performance</h3>
                <div className={Styles.formGrid}>
                  <div className={Styles.formGroup}>
                    <label>P&L Amount</label>
                    <div className={Styles.calculatedField}>
                      ₹{formData.pnl_amount.toFixed(2)}
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>P&L Percentage</label>
                    <div className={Styles.calculatedField}>
                      {formData.pnl_percentage.toFixed(2)}%
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Holding Period (Minutes)</label>
                    <input
                      type="number"
                      value={formData.holding_period_minutes ?? ""}
                      onChange={e => handleNumberInputChange("holding_period_minutes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={Styles.section}>
                <h3>Tags</h3>
                <div className={Styles.tagInputContainer}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add tag and press Enter"
                    onKeyPress={e =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <button type="button" onClick={addTag}>
                    Add
                  </button>
                </div>
                <div className={Styles.tagsContainer}>
                  {formData.tags.map(tag => (
                    <span key={tag} className={Styles.tag}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Next Button for General Tab */}
              <div className={Styles.formActions}>
                <button
                  type="button"
                  onClick={handleNext}
                  className={Styles.nextBtn}
                >
                  Next: Psychology <FaArrowRight />
                </button>
              </div>
            </div>
          )}
          {activeTab === "psychology" && (
            <div className={Styles.formContent}>
              <div className={Styles.section}>
                <h3>Psychology</h3>
                <div className={Styles.sectionContent}>
                  <div className={Styles.formGrid}>
                    <div className={Styles.formGroup}>
                      <label>
                        Entry Confidence: {formData.psychology.entry_confidence_level}/10{" "}
                        <span className={Styles.required}>*</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.psychology.entry_confidence_level}
                        onChange={e =>
                          handlePsychologyChange({
                            entry_confidence_level: Number(e.target.value),
                          })
                        }
                        required
                        className={Styles.rangeInput}
                        style={getRangeProgressStyle(
                          formData.psychology.entry_confidence_level,
                          1,
                          10
                        )}
                      />
                    </div>
                    <div className={Styles.formGroup}>
                      <label>
                        Satisfaction Rating: {formData.psychology.satisfaction_rating}/10{" "}
                        <span className={Styles.required}>*</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.psychology.satisfaction_rating}
                        onChange={e =>
                          handlePsychologyChange({
                            satisfaction_rating: Number(e.target.value),
                          })
                        }
                        required
                        className={Styles.rangeInput}
                        style={getRangeProgressStyle(
                          formData.psychology.satisfaction_rating,
                          1,
                          10
                        )}
                      />
                    </div>
                    <div className={Styles.formGroup}>
                      <label>
                        Emotional State <span className={Styles.required}>*</span>
                      </label>
                      <select
                        value={formData.psychology.emotional_state}
                        onChange={e =>
                          handlePsychologyChange({
                            emotional_state: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select State</option>
                        {emotionalStates.map(o => (
                          <option key={o._id} value={o._id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Mistakes Made</label>
                    <div className={Styles.tagInputContainer}>
                      <input
                        type="text"
                        value={newMistake}
                        onChange={e => setNewMistake(e.target.value)}
                        placeholder="Add mistake and press Enter"
                        onKeyPress={e =>
                          e.key === "Enter" && (e.preventDefault(), addMistake())
                        }
                      />
                      <button type="button" onClick={addMistake}>
                        Add
                      </button>
                    </div>
                    <div className={Styles.tagsContainer}>
                      {formData.psychology.mistakes_made.map(mistake => (
                        <span key={mistake} className={Styles.tag}>
                          {mistake}
                          <button
                            type="button"
                            onClick={() => removeMistake(mistake)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={Styles.formGroup}>
                    <label>Lessons Learned</label>
                    <textarea
                      value={formData.psychology.lessons_learned}
                      onChange={e =>
                        handlePsychologyChange({
                          lessons_learned: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className={Styles.formActions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={Styles.resetBtn}
                  title="Reset Form"
                >
                  <RiResetLeftLine />
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={Styles.submitBtn}
                >
                  {tradeToEdit ? "Update Trade" : "Save Trade"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewTradePopup;
