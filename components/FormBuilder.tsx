
import React from 'react';
import { FormEntity, FormField } from '../types';
import { Plus, Trash2, GripVertical, Type, Mail, Hash, Calendar, ChevronDown, MessageSquare } from 'lucide-react';

interface FormBuilderProps {
  form: FormEntity;
  onChange: (updates: Partial<FormEntity>) => void;
}

const FIELD_ICONS: Record<string, any> = {
  text: Type,
  email: Mail,
  number: Hash,
  date: Calendar,
  select: ChevronDown,
  textarea: MessageSquare
};

const FormBuilder: React.FC<FormBuilderProps> = ({ form, onChange }) => {
  const addField = () => {
    const newField: FormField = {
      id: `f_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter text...'
    };
    onChange({ fields: [...form.fields, newField] });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange({
      fields: form.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeField = (id: string) => {
    onChange({
      fields: form.fields.filter(f => f.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Form Fields</label>
          <button 
            onClick={addField}
            className="text-[10px] font-black uppercase tracking-widest text-[#FF7575] hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add Field
          </button>
        </div>

        <div className="space-y-3">
          {form.fields.map((field, index) => {
            const Icon = FIELD_ICONS[field.type] || Type;
            return (
              <div key={field.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-slate-400 border border-slate-100">
                      <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Field {index + 1}</span>
                  </div>
                  <button 
                    onClick={() => removeField(field.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input 
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field Label"
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#FF7575] transition-all"
                    />
                  </div>
                  <div>
                    <select 
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                      className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="select">Dropdown</option>
                      <option value="textarea">Long Text</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end px-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-3 h-3 rounded border-slate-200 text-[#FF7575] focus:ring-[#FF7575]"
                      />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Required</span>
                    </label>
                  </div>
                </div>

                {field.type === 'select' && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Options (comma separated)</label>
                    <input 
                      value={field.options?.join(', ') || ''}
                      onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="Option 1, Option 2, Option 3"
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-600 outline-none focus:border-[#FF7575] transition-all"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Submit Button Text</label>
          <input 
            value={form.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="e.g. Submit Request"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF7575] transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmation Message</label>
          <textarea 
            value={form.confirmationMessage}
            onChange={(e) => onChange({ confirmationMessage: e.target.value })}
            placeholder="What happens after they submit?"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-[#FF7575] transition-all min-h-[80px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
