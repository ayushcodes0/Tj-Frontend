import React, { useState, useEffect } from 'react';
import Styles from "./NewTradePopup.module.css";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io"; // Import React Icons

interface NewTradePopupProps {
  onClose: () => void;
}

interface TradeFormData {
  symbol: string;
  date: string;
  quantity: number | null; // Allow null for better UX
  total_amount: number;
  entry_price: number | null; // Allow null for better UX
  exit_price: number | null; // Allow null for better UX
  direction: 'Long' | 'Short';
  stop_loss: number | null; // Allow null for better UX
  target: number | null; // Allow null for better UX
  strategy: string;
  trade_analysis: string;
  outcome_summary: string;
  rules_followed: string[];
  pnl_amount: number;
  pnl_percentage: number;
  holding_period_minutes: number | null; // Allow null for better UX
  tags: string[];
  psychology: {
    entry_confidence_level: number;
    satisfaction_rating: number;
    emotional_state: string;
    mistakes_made: string[];
    lessons_learned: string;
  };
}

const NewTradePopup: React.FC<NewTradePopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'psychology'>('general');
  const [formData, setFormData] = useState<TradeFormData>({
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
  });

  // Auto-calculation logic
  useEffect(() => {
    const { quantity, entry_price, exit_price, direction } = formData;
    
    const numQuantity = quantity ?? 0; // Use nullish coalescing for default to 0
    const numEntryPrice = entry_price ?? 0;
    const numExitPrice = exit_price ?? 0;

    // 1. Calculate Total Amount
    const newTotalAmount = numQuantity * numEntryPrice;

    // 2. Calculate P&L Amount
    let newPnlAmount = 0;
    if (numQuantity > 0 && numEntryPrice > 0 && numExitPrice > 0) {
      if (direction === 'Long') {
        newPnlAmount = (numExitPrice - numEntryPrice) * numQuantity;
      } else { // Short
        newPnlAmount = (numEntryPrice - numExitPrice) * numQuantity;
      }
    }

    // 3. Calculate P&L Percentage
    const newPnlPercentage = newTotalAmount !== 0 ? (newPnlAmount / newTotalAmount) * 100 : 0; // Check for newTotalAmount !== 0

    // Only update if the calculated values actually change to avoid unnecessary re-renders
    if (
      newTotalAmount !== formData.total_amount ||
      newPnlAmount !== formData.pnl_amount ||
      newPnlPercentage !== formData.pnl_percentage
    ) {
      setFormData(prev => ({
        ...prev,
        total_amount: newTotalAmount,
        pnl_amount: newPnlAmount,
        pnl_percentage: newPnlPercentage
      }));
    }

  }, [formData.quantity, formData.entry_price, formData.exit_price, formData.direction, formData.total_amount, formData.pnl_amount, formData.pnl_percentage]);


  const [newTag, setNewTag] = useState('');
  const [newMistake, setNewMistake] = useState('');

  // Sample dropdown options
  const strategyOptions = [
    { value: 'breakout', label: 'Breakout Strategy' },
    { value: 'reversal', label: 'Reversal Strategy' },
    { value: 'momentum', label: 'Momentum Strategy' }
  ];
  const outcomeSummaryOptions = [
    { value: 'success', label: 'Successful Trade' },
    { value: 'fail', label: 'Failed Trade' },
    { value: 'partial', label: 'Partial Success' }
  ];
  const rulesFollowedOptions = [
    { value: 'entry', label: 'Entry Rules' },
    { value: 'exit', label: 'Exit Rules' },
    { value: 'risk', label: 'Risk Management' }
  ];
  const emotionalStateOptions = [
    { value: 'confident', label: 'Confident' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'neutral', label: 'Neutral' }
  ];

  type TradeFormValue = | string | number | null | string[] | 'Long' | 'Short' | Partial<TradeFormData['psychology']>;

  const handleInputChange = (field: keyof TradeFormData, value: TradeFormValue) => {
    if (field === 'psychology') {
      setFormData(prev => ({
        ...prev,
        psychology: { ...prev.psychology, ...(value as Partial<TradeFormData['psychology']>) }
      }));
    } else if (typeof value === 'string' && (field === 'quantity' || field === 'entry_price' || field === 'exit_price' || field === 'stop_loss' || field === 'target' || field === 'holding_period_minutes')) {
      // For number inputs, allow empty string but store as null
      setFormData(prev => ({ ...prev, [field]: value === '' ? null : Number(value) }));
    }
    else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMultiSelect = (field: 'rules_followed', value: string) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleInputChange(field, newValues);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag));
  };

  const addMistake = () => {
    if (newMistake.trim() && !formData.psychology.mistakes_made.includes(newMistake.trim())) {
      handleInputChange('psychology', {
        mistakes_made: [...formData.psychology.mistakes_made, newMistake.trim()]
      });
      setNewMistake('');
    }
  };

  const removeMistake = (mistake: string) => {
    handleInputChange('psychology', {
      mistakes_made: formData.psychology.mistakes_made.filter(m => m !== mistake)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onClose();
  };

  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.newTradePopup} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>
          <h2>New Trade Entry</h2>
          <button className={Styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={Styles.tabNavigation}>
          <button
            type="button"
            className={`${Styles.tabBtn} ${activeTab === 'general' ? Styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`${Styles.tabBtn} ${activeTab === 'psychology' ? Styles.active : ''}`}
            onClick={() => setActiveTab('psychology')}
          >
            Psychology
          </button>
        </div>

        <form onSubmit={handleSubmit} className={Styles.form}>
          {activeTab === 'general' && (
            <>
              <div className={Styles.section}>
                <h3>Trade Details</h3>
                <div className={Styles.formGrid}>
                  <div className={Styles.formGroup}><label>Symbol <span className={Styles.required}>*</span></label><input type="text" value={formData.symbol} onChange={(e) => handleInputChange('symbol', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Date <span className={Styles.required}>*</span></label><input type="datetime-local" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Direction <span className={Styles.required}>*</span></label><div className={Styles.directionContainer}><button type="button" className={`${Styles.directionBtn} ${formData.direction === 'Long' ? Styles.active : ''}`} onClick={() => handleInputChange('direction', 'Long')}><IoMdArrowDropup className={Styles.directionIcon} /> Long</button><button type="button" className={`${Styles.directionBtn} ${formData.direction === 'Short' ? Styles.active : ''}`} onClick={() => handleInputChange('direction', 'Short')}><IoMdArrowDropdown className={Styles.directionIcon} /> Short</button></div></div>
                  <div className={Styles.formGroup}><label>Quantity <span className={Styles.required}>*</span></label><input type="number" value={formData.quantity ?? ''} onChange={(e) => handleInputChange('quantity', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Entry Price <span className={Styles.required}>*</span></label><input type="number" step="0.01" value={formData.entry_price ?? ''} onChange={(e) => handleInputChange('entry_price', e.target.value)} required /></div>
                  <div className={Styles.formGroup}><label>Exit Price</label><input type="number" step="0.01" value={formData.exit_price ?? ''} onChange={(e) => handleInputChange('exit_price', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Stop Loss</label><input type="number" step="0.01" value={formData.stop_loss ?? ''} onChange={(e) => handleInputChange('stop_loss', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Target</label><input type="number" step="0.01" value={formData.target ?? ''} onChange={(e) => handleInputChange('target', e.target.value)} /></div>
                  <div className={Styles.formGroup}><label>Total Amount</label><div className={Styles.calculatedField}>₹{formData.total_amount.toFixed(2)}</div></div>
                </div>
              </div>

              <div className={Styles.section}>
                <h3>Strategy & Analysis</h3>
                <div className={Styles.formGrid}><div className={Styles.formGroup}><label>Strategy <span className={Styles.required}>*</span></label><select value={formData.strategy} onChange={(e) => handleInputChange('strategy', e.target.value)} required><option value="">Select Strategy</option>{strategyOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div><div className={Styles.formGroup}><label>Outcome <span className={Styles.required}>*</span></label><select value={formData.outcome_summary} onChange={(e) => handleInputChange('outcome_summary', e.target.value)} required><option value="">Select Outcome</option>{outcomeSummaryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></div>
                <div className={Styles.formGroup}><label>Trade Analysis <span className={Styles.required}>*</span></label><textarea value={formData.trade_analysis} onChange={(e) => handleInputChange('trade_analysis', e.target.value)} rows={3} required /></div>
                <div className={Styles.formGroup}><label>Rules Followed <span className={Styles.required}>*</span></label><div className={Styles.multiSelectContainer}>{rulesFollowedOptions.map(o => <label key={o.value} className={Styles.checkboxLabel}><input type="checkbox" checked={formData.rules_followed.includes(o.value)} onChange={() => handleMultiSelect('rules_followed', o.value)} />{o.label}</label>)}</div></div>
              </div>

              <div className={Styles.section}>
                <h3>Performance</h3>
                <div className={Styles.formGrid}><div className={Styles.formGroup}><label>P&L Amount</label><div className={Styles.calculatedField}>₹{formData.pnl_amount.toFixed(2)}</div></div><div className={Styles.formGroup}><label>P&L Percentage</label><div className={Styles.calculatedField}>{formData.pnl_percentage.toFixed(2)}%</div></div><div className={Styles.formGroup}><label>Holding Period (Minutes)</label><input type="number" value={formData.holding_period_minutes ?? ''} onChange={(e) => handleInputChange('holding_period_minutes', e.target.value)} /></div></div>
              </div>
              
              <div className={Styles.section}>
                <h3>Tags</h3>
                <div className={Styles.tagInputContainer}><input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag and press Enter" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} /><button type="button" onClick={addTag}>Add</button></div>
                <div className={Styles.tagsContainer}>{formData.tags.map(tag => (<span key={tag} className={Styles.tag}>{tag}<button type="button" onClick={() => removeTag(tag)}>×</button></span>))}</div>
              </div>
            </>
          )}

          {activeTab === 'psychology' && (
            <div className={Styles.section}>
              <h3>Psychology</h3>
              <div className={Styles.formGrid}>
                <div className={Styles.formGroup}><label>Entry Confidence: {formData.psychology.entry_confidence_level}/10 <span className={Styles.required}>*</span></label><input type="range" min="1" max="10" value={formData.psychology.entry_confidence_level} onChange={(e) => handleInputChange('psychology', { entry_confidence_level: Number(e.target.value) })} required/></div>
                <div className={Styles.formGroup}><label>Satisfaction Rating: {formData.psychology.satisfaction_rating}/10 <span className={Styles.required}>*</span></label><input type="range" min="1" max="10" value={formData.psychology.satisfaction_rating} onChange={(e) => handleInputChange('psychology', { satisfaction_rating: Number(e.target.value) })} required/></div>
                <div className={Styles.formGroup}><label>Emotional State <span className={Styles.required}>*</span></label><select value={formData.psychology.emotional_state} onChange={(e) => handleInputChange('psychology', { emotional_state: e.target.value })} required><option value="">Select State</option>{emotionalStateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div className={Styles.formGroup}><label>Mistakes Made</label><div className={Styles.tagInputContainer}><input type="text" value={newMistake} onChange={(e) => setNewMistake(e.target.value)} placeholder="Add mistake and press Enter" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMistake())} /><button type="button" onClick={addMistake}>Add</button></div><div className={Styles.tagsContainer}>{formData.psychology.mistakes_made.map(mistake => (<span key={mistake} className={Styles.tag}>{mistake}<button type="button" onClick={() => removeMistake(mistake)}>×</button></span>))}</div></div>
              <div className={Styles.formGroup}><label>Lessons Learned <span className={Styles.required}>*</span></label><textarea value={formData.psychology.lessons_learned} onChange={(e) => handleInputChange('psychology', { lessons_learned: e.target.value })} rows={3} required/></div>
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
