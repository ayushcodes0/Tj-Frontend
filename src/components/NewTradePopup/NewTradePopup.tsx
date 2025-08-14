import React, { useState, useEffect, useCallback } from 'react';
import Styles from "./NewTradePopup.module.css";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import {
  fetchOptions,
  addOption,
  saveTrade,
} from '../../services/apiService'; 
import type { TradeFormData } from '../../types/trade';

interface NewTradePopupProps {
  onClose: () => void;
}

interface Option {
  _id: string;
  name: string;
}

const NewTradePopup: React.FC<NewTradePopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'psychology'>('general');
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: '', date: '', quantity: null, total_amount: 0, entry_price: null,
    exit_price: null, direction: 'Long', stop_loss: null, target: null,
    strategy: '', trade_analysis: '', outcome_summary: '', rules_followed: [],
    pnl_amount: 0, pnl_percentage: 0, holding_period_minutes: null, tags: [],
    psychology: { entry_confidence_level: 5, satisfaction_rating: 5, emotional_state: '', mistakes_made: [], lessons_learned: '' }
  });

  const [strategies, setStrategies] = useState<Option[]>([]);
  const [outcomeSummaries, setOutcomeSummaries] = useState<Option[]>([]);
  const [rulesOptions, setRulesOptions] = useState<Option[]>([]);
  const [emotionalStates, setEmotionalStates] = useState<Option[]>([]);
  
  const [newCustomStrategyName, setNewCustomStrategyName] = useState('');
  const [newCustomRuleName, setNewCustomRuleName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newMistake, setNewMistake] = useState('');

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
      } catch (error) {
        console.error('Failed to fetch options:', error);
        alert('Could not load trading options. Please check your connection and try again.');
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    const { quantity, entry_price, exit_price, direction } = formData;
    const numQuantity = quantity ?? 0;
    const numEntryPrice = entry_price ?? 0;
    const numExitPrice = exit_price ?? 0;
    const newTotalAmount = numQuantity * numEntryPrice;
    let newPnlAmount = 0;
    if (numQuantity > 0 && numEntryPrice > 0 && numExitPrice > 0) {
      newPnlAmount = direction === 'Long' ? (numExitPrice - numEntryPrice) * numQuantity : (numEntryPrice - numExitPrice) * numQuantity;
    }
    const newPnlPercentage = newTotalAmount !== 0 ? (newPnlAmount / newTotalAmount) * 100 : 0;
    setFormData(prev => ({
      ...prev,
      total_amount: parseFloat(newTotalAmount.toFixed(2)),
      pnl_amount: parseFloat(newPnlAmount.toFixed(2)),
      pnl_percentage: parseFloat(newPnlPercentage.toFixed(2))
    }));
  }, [formData.quantity, formData.entry_price, formData.exit_price, formData.direction]);

  const handleUpdateField = useCallback(<K extends keyof TradeFormData>(field: K, value: TradeFormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  const handlePsychologyChange = useCallback((value: Partial<TradeFormData['psychology']>) => {
      setFormData(prev => ({ ...prev, psychology: { ...prev.psychology, ...value } }));
  }, []);
  const handleNumberInputChange = (field: 'quantity' | 'entry_price' | 'exit_price' | 'stop_loss' | 'target' | 'holding_period_minutes', value: string) => {
      handleUpdateField(field, value === '' ? null : Number(value));
  };
  const handleMultiSelect = useCallback((ruleId: string) => {
      const currentValues = formData.rules_followed;
      const newValues = currentValues.includes(ruleId) ? currentValues.filter(id => id !== ruleId) : [...currentValues, ruleId];
      handleUpdateField('rules_followed', newValues);
  }, [formData.rules_followed, handleUpdateField]);
  const addTag = useCallback(() => {
      if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
          handleUpdateField('tags', [...formData.tags, newTag.trim()]);
          setNewTag('');
      }
  }, [newTag, formData.tags, handleUpdateField]);
  const removeTag = useCallback((tag: string) => {
      handleUpdateField('tags', formData.tags.filter(t => t !== tag));
  }, [formData.tags, handleUpdateField]);
  const addMistake = useCallback(() => {
      if (newMistake.trim() && !formData.psychology.mistakes_made.includes(newMistake.trim())) {
          handlePsychologyChange({ mistakes_made: [...formData.psychology.mistakes_made, newMistake.trim()] });
          setNewMistake('');
      }
  }, [newMistake, formData.psychology.mistakes_made]);
  const removeMistake = useCallback((mistake: string) => {
      handlePsychologyChange({ mistakes_made: formData.psychology.mistakes_made.filter(m => m !== mistake) });
  }, [formData.psychology.mistakes_made]);
  const handleAddCustomStrategy = async () => {
      if (!newCustomStrategyName.trim()) return;
      try {
          const newOption = await addOption('Strategy', newCustomStrategyName.trim());
          setStrategies(prev => [...prev, newOption]);
          handleUpdateField('strategy', newOption._id);
          setNewCustomStrategyName('');
      } catch (error) {
          alert(`Failed to add strategy: ${error}`);
      }
  };
  const handleAddCustomRule = async () => {
      if (!newCustomRuleName.trim()) return;
      try {
          const newOption = await addOption('RulesFollowed', newCustomRuleName.trim());
          setRulesOptions(prev => [...prev, newOption]);
          handleMultiSelect(newOption._id);
          setNewCustomRuleName('');
      } catch (error) {
          alert(`Failed to add rule: ${error}`);
      }
  };
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await saveTrade(formData);
          alert('Trade saved successfully!');
          onClose();
      } catch (error) {
          console.error('Failed to save trade:', error);
          alert(`Failed to save trade: ${error}`);
      }
  };

  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.newTradePopup} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}><h2>New Trade Entry</h2><button className={Styles.closeBtn} onClick={onClose}>×</button></div>
        <div className={Styles.tabNavigation}>
          <button type="button" className={`${Styles.tabBtn} ${activeTab === 'general' ? Styles.active : ''}`} onClick={() => setActiveTab('general')}>General</button>
          <button type="button" className={`${Styles.tabBtn} ${activeTab === 'psychology' ? Styles.active : ''}`} onClick={() => setActiveTab('psychology')}>Psychology</button>
        </div>
        <form onSubmit={handleSubmit} className={Styles.form}>
          {activeTab === 'general' && (
            <div className={Styles.formContent}>
              <div className={Styles.section}>
                <h3>Trade Details</h3>
                {/* --- FIX: Added a specific class for the 4-column layout --- */}
                <div className={`${Styles.formGrid} ${Styles.tradeDetailsGrid}`}>
                  <div className={Styles.formGroup}><label>Symbol <span className={Styles.required}>*</span></label><input type="text" value={formData.symbol} onChange={(e) => handleUpdateField('symbol', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Date <span className={Styles.required}>*</span></label><input type="datetime-local" value={formData.date} onChange={(e) => handleUpdateField('date', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Quantity <span className={Styles.required}>*</span></label><input type="number" value={formData.quantity ?? ''} onChange={(e) => handleNumberInputChange('quantity', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Direction <span className={Styles.required}>*</span></label><div className={Styles.directionContainer}><button type="button" className={`${Styles.directionBtn} ${formData.direction === 'Long' ? Styles.active : ''}`} onClick={() => handleUpdateField('direction', 'Long')}><IoMdArrowDropup /> Long</button><button type="button" className={`${Styles.directionBtn} ${formData.direction === 'Short' ? Styles.active : ''}`} onClick={() => handleUpdateField('direction', 'Short')}><IoMdArrowDropdown /> Short</button></div></div>
                  <div className={Styles.formGroup}><label>Entry Price <span className={Styles.required}>*</span></label><input type="number" step="0.01" value={formData.entry_price ?? ''} onChange={(e) => handleNumberInputChange('entry_price', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Exit Price</label><input type="number" step="0.01" value={formData.exit_price ?? ''} onChange={(e) => handleNumberInputChange('exit_price', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Stop Loss</label><input type="number" step="0.01" value={formData.stop_loss ?? ''} onChange={(e) => handleNumberInputChange('stop_loss', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Target</label><input type="number" step="0.01" value={formData.target ?? ''} onChange={(e) => handleNumberInputChange('target', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Total Amount</label><div className={Styles.calculatedField}>₹{formData.total_amount.toFixed(2)}</div></div>
                </div>
              </div>

              {/* Other sections remain the same */}
              <div className={Styles.section}>
                <h3>Strategy & Analysis</h3>
                <div className={Styles.sectionContent}>
                    <div className={Styles.formGrid}>
                        <div className={Styles.formGroup}><label>Strategy <span className={Styles.required}>*</span></label><select value={formData.strategy} onChange={(e) => handleUpdateField('strategy', e.target.value)} required><option value="">Select Strategy</option>{strategies.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}</select><div className={Styles.addCustomContainer}><input type="text" value={newCustomStrategyName} onChange={(e) => setNewCustomStrategyName(e.target.value)} placeholder="Or add new strategy..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomStrategy())} /><button type="button" onClick={handleAddCustomStrategy}>Add</button></div></div>
                        <div className={Styles.formGroup}><label>Outcome <span className={Styles.required}>*</span></label><select value={formData.outcome_summary} onChange={(e) => handleUpdateField('outcome_summary', e.target.value)} required><option value="">Select Outcome</option>{outcomeSummaries.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}</select></div>
                    </div>
                    <div className={Styles.formGroup}><label>Trade Analysis <span className={Styles.required}>*</span></label><textarea value={formData.trade_analysis} onChange={(e) => handleUpdateField('trade_analysis', e.target.value)} rows={4} required /></div>
                    <div className={Styles.formGroup}><label>Rules Followed <span className={Styles.required}>*</span></label><div className={Styles.multiSelectContainer}>{rulesOptions.map(o => <label key={o._id} className={Styles.checkboxLabel}><input type="checkbox" checked={formData.rules_followed.includes(o._id)} onChange={() => handleMultiSelect(o._id)} />{o.name}</label>)}</div><div className={Styles.addCustomContainer}><input type="text" value={newCustomRuleName} onChange={(e) => setNewCustomRuleName(e.target.value)} placeholder="Or add new rule..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomRule())} /><button type="button" onClick={handleAddCustomRule}>Add</button></div></div>
                </div>
              </div>
              <div className={Styles.section}>
                <h3>Performance</h3>
                <div className={Styles.formGrid}><div className={Styles.formGroup}><label>P&L Amount</label><div className={Styles.calculatedField}>₹{formData.pnl_amount.toFixed(2)}</div></div><div className={Styles.formGroup}><label>P&L Percentage</label><div className={Styles.calculatedField}>{formData.pnl_percentage.toFixed(2)}%</div></div><div className={Styles.formGroup}><label>Holding Period (Minutes)</label><input type="number" value={formData.holding_period_minutes ?? ''} onChange={(e) => handleNumberInputChange('holding_period_minutes', e.target.value)} /></div></div>
              </div>
              <div className={Styles.section}>
                <h3>Tags</h3>
                <div className={Styles.tagInputContainer}><input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag and press Enter" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} /><button type="button" onClick={addTag}>Add</button></div>
                <div className={Styles.tagsContainer}>{formData.tags.map(tag => (<span key={tag} className={Styles.tag}>{tag}<button type="button" onClick={() => removeTag(tag)}>×</button></span>))}</div>
              </div>
            </div>
          )}
          {activeTab === 'psychology' && (
            <div className={Styles.formContent}>
                <div className={Styles.section}>
                    <h3>Psychology</h3>
                    <div className={Styles.sectionContent}>
                        <div className={Styles.formGrid}><div className={Styles.formGroup}><label>Entry Confidence: {formData.psychology.entry_confidence_level}/10 <span className={Styles.required}>*</span></label><input type="range" min="1" max="10" value={formData.psychology.entry_confidence_level} onChange={(e) => handlePsychologyChange({ entry_confidence_level: Number(e.target.value) })} required/></div><div className={Styles.formGroup}><label>Satisfaction Rating: {formData.psychology.satisfaction_rating}/10 <span className={Styles.required}>*</span></label><input type="range" min="1" max="10" value={formData.psychology.satisfaction_rating} onChange={(e) => handlePsychologyChange({ satisfaction_rating: Number(e.target.value) })} required/></div><div className={Styles.formGroup}><label>Emotional State <span className={Styles.required}>*</span></label><select value={formData.psychology.emotional_state} onChange={(e) => handlePsychologyChange({ emotional_state: e.target.value })} required><option value="">Select State</option>{emotionalStates.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}</select></div></div>
                        <div className={Styles.formGroup}><label>Mistakes Made</label><div className={Styles.tagInputContainer}><input type="text" value={newMistake} onChange={(e) => setNewMistake(e.target.value)} placeholder="Add mistake and press Enter" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMistake())} /><button type="button" onClick={addMistake}>Add</button></div><div className={Styles.tagsContainer}>{formData.psychology.mistakes_made.map(mistake => (<span key={mistake} className={Styles.tag}>{mistake}<button type="button" onClick={() => removeMistake(mistake)}>×</button></span>))}</div></div>
                        <div className={Styles.formGroup}><label>Lessons Learned <span className={Styles.required}>*</span></label><textarea value={formData.psychology.lessons_learned} onChange={(e) => handlePsychologyChange({ lessons_learned: e.target.value })} rows={4} required/></div>
                    </div>
                </div>
            </div>
          )}
          <div className={Styles.formActions}>
            <button type="button" onClick={onClose} className={Styles.cancelBtn}>Cancel</button>
            <button type="submit" className={Styles.submitBtn}>Save Trade</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTradePopup;
