
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X, Check, Image as ImageIcon, Trash2, Plus, List } from 'lucide-react';
import { FormField } from '../../types';

interface DashboardEntityModalProps {
  entityId: string | null; // If null, creating new
  entityType: 'service' | 'product' | 'event' | 'property' | 'form';
  onClose: () => void;
}

const DashboardEntityModal: React.FC<DashboardEntityModalProps> = ({ entityId, entityType, onClose }) => {
  const store = useStore();
  const [formData, setFormData] = useState<any>({});
  
  // Field Editor State for Form Type
  const [activeField, setActiveField] = useState<Partial<FormField> | null>(null);

  // Initialize data on mount
  useEffect(() => {
    if (entityId) {
      // Edit Mode: Find existing entity
      let found: any = null;
      if (entityType === 'service') found = store.services.find(s => s.id === entityId);
      if (entityType === 'product') found = store.products.find(p => p.id === entityId);
      if (entityType === 'event') found = store.events.find(e => e.id === entityId);
      if (entityType === 'property') found = store.properties.find(p => p.id === entityId);
      if (entityType === 'form') found = store.forms.find(f => f.id === entityId);
      
      if (found) setFormData(JSON.parse(JSON.stringify(found)));
    } else {
      // Create Mode: Default Data
      const baseDefaults = {
          id: `${entityType}_${Date.now()}`,
          title: `New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
          image: 'https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=1000&auto=format&fit=crop',
          description: 'Add a description...',
          buttonText: 'View Details',
          features: ['Feature 1']
      };

      if (entityType === 'service') {
          setFormData({ ...baseDefaults, duration: 60, price: '$100', availability: { days: [1,2,3,4,5], startTime: '09:00', endTime: '17:00' } });
      } else if (entityType === 'product') {
          setFormData({ ...baseDefaults, price: '$49', images: [baseDefaults.image] });
      } else if (entityType === 'event') {
          setFormData({ ...baseDefaults, date: 'Oct 30, 2024', time: '7:00 PM', location: 'Online' });
      } else if (entityType === 'property') {
          setFormData({ ...baseDefaults, price: '$500,000', location: 'New York, NY', beds: 2, baths: 2, images: [baseDefaults.image] });
      } else if (entityType === 'form') {
          setFormData({ ...baseDefaults, fields: [
              { id: 'f1', label: 'Name', type: 'text', placeholder: 'John Doe' },
              { id: 'f2', label: 'Email', type: 'email', placeholder: 'you@example.com' }
          ] });
      }
    }
  }, [entityId, entityType]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  
  // Field Management
  const addField = () => {
      const newField: FormField = {
          id: `field_${Date.now()}`,
          label: 'New Field',
          type: 'text',
          placeholder: '',
      };
      setFormData((prev: any) => ({ ...prev, fields: [...(prev.fields || []), newField] }));
      setActiveField(newField);
  };
  
  const updateField = (id: string, updates: Partial<FormField>) => {
      setFormData((prev: any) => ({
          ...prev,
          fields: prev.fields.map((f: FormField) => f.id === id ? { ...f, ...updates } : f)
      }));
      // Also update local active state if editing
      if (activeField?.id === id) {
          setActiveField(prev => ({ ...prev, ...updates }));
      }
  };

  const removeField = (id: string) => {
      setFormData((prev: any) => ({
          ...prev,
          fields: prev.fields.filter((f: FormField) => f.id !== id)
      }));
      if (activeField?.id === id) setActiveField(null);
  };

  const handleSave = () => {
    if (entityId) {
       // Update
       if (entityType === 'service') store.updateService(entityId, formData);
       if (entityType === 'product') store.updateProduct(entityId, formData);
       if (entityType === 'event') store.updateEvent(entityId, formData);
       if (entityType === 'property') store.updateProperty(entityId, formData);
       if (entityType === 'form') store.updateForm(entityId, formData);
    } else {
       // Create
       if (entityType === 'service') store.addService(formData);
       if (entityType === 'product') store.addProduct(formData);
       if (entityType === 'event') store.addEvent(formData);
       if (entityType === 'property') store.addProperty(formData);
       if (entityType === 'form') store.addForm(formData);
    }
    onClose();
  };

  const handleDelete = () => {
      if (confirm('Are you sure you want to delete this item?')) {
        if (entityType === 'service') store.deleteService(entityId!);
        if (entityType === 'product') store.deleteProduct(entityId!);
        if (entityType === 'event') store.deleteEvent(entityId!);
        if (entityType === 'property') store.deleteProperty(entityId!);
        if (entityType === 'form') store.deleteForm(entityId!);
        onClose();
      }
  };

  const InputField = ({ label, field, placeholder }: any) => (
      <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
          <input 
            type="text" 
            value={formData[field] || ''} 
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white transition-all"
          />
      </div>
  );

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div 
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{entityId ? 'Edit' : 'New'} {entityType}</h3>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* Image Preview */}
                <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {formData.image ? (
                            <img src={formData.image} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Image URL</label>
                        <input 
                            type="text" 
                            value={formData.image || ''} 
                            onChange={(e) => handleChange('image', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-mono text-slate-600 outline-none focus:border-[#FF7575] focus:bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Title" field="title" placeholder="Item Name" />
                    {entityType !== 'form' && <InputField label="Price / Fee" field="price" placeholder="$0.00" />}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                    <textarea 
                        value={formData.description || ''} 
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 outline-none focus:border-[#FF7575] focus:bg-white min-h-[100px] resize-none"
                    />
                </div>

                {/* Dynamic Fields based on Type */}
                {entityType === 'service' && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <InputField label="Duration (min)" field="duration" placeholder="60" />
                        <InputField label="Start Time" field="availability.startTime" placeholder="09:00" />
                    </div>
                )}

                {entityType === 'event' && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <InputField label="Date" field="date" placeholder="Oct 24, 2024" />
                        <InputField label="Time" field="time" placeholder="6:00 PM" />
                        <div className="col-span-2">
                            <InputField label="Location" field="location" placeholder="Address or Link" />
                        </div>
                    </div>
                )}

                {entityType === 'property' && (
                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="col-span-3">
                             <InputField label="Location" field="location" placeholder="Address" />
                        </div>
                        <InputField label="Beds" field="beds" placeholder="2" />
                        <InputField label="Baths" field="baths" placeholder="2" />
                    </div>
                )}
                
                {/* FORM BUILDER */}
                {entityType === 'form' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                         <div className="flex justify-between items-center">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Custom Fields</label>
                             <button onClick={addField} className="text-[9px] font-bold text-[#FF7575] uppercase hover:underline">+ Add Field</button>
                         </div>
                         
                         <div className="space-y-2">
                             {formData.fields?.map((field: FormField, idx: number) => (
                                 <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between group">
                                     <div className="flex-1">
                                         <p className="text-xs font-bold text-slate-800">{field.label}</p>
                                         <p className="text-[9px] text-slate-400 uppercase tracking-wider">{field.type} {field.type === 'select' && `(${field.options?.length || 0} options)`}</p>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <button onClick={() => setActiveField(field)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-800"><List size={12} /></button>
                                         <button onClick={() => removeField(field.id)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         
                         {/* FIELD EDITOR */}
                         {activeField && (
                             <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Edit Field</span>
                                     <button onClick={() => setActiveField(null)} className="text-slate-300 hover:text-slate-800"><X size={14} /></button>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Label</span>
                                        <input 
                                            value={activeField.label} 
                                            onChange={(e) => updateField(activeField.id!, { label: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Type</span>
                                        <select 
                                            value={activeField.type} 
                                            onChange={(e) => updateField(activeField.id!, { type: e.target.value as any })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-bold outline-none"
                                        >
                                            <option value="text">Text Input</option>
                                            <option value="email">Email</option>
                                            <option value="textarea">Long Text</option>
                                            <option value="date">Date Picker</option>
                                            <option value="select">Dropdown (Select)</option>
                                        </select>
                                    </div>
                                 </div>
                                 <div className="space-y-1">
                                     <span className="text-[8px] font-bold text-slate-400 uppercase">Placeholder</span>
                                     <input 
                                         value={activeField.placeholder} 
                                         onChange={(e) => updateField(activeField.id!, { placeholder: e.target.value })}
                                         className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-medium"
                                     />
                                 </div>
                                 
                                 {activeField.type === 'select' && (
                                     <div className="space-y-1">
                                         <span className="text-[8px] font-bold text-slate-400 uppercase">Options (Comma separated)</span>
                                         <textarea 
                                             value={activeField.options?.join(', ')} 
                                             onChange={(e) => updateField(activeField.id!, { options: e.target.value.split(',').map(s => s.trim()) })}
                                             className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-medium resize-none min-h-[60px]"
                                             placeholder="Option 1, Option 2, Option 3"
                                         />
                                     </div>
                                 )}
                             </div>
                         )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Button Label</label>
                    <input 
                        type="text" 
                        value={formData.buttonText || ''} 
                        onChange={(e) => handleChange('buttonText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white"
                    />
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
                {entityId && (
                    <button 
                        onClick={handleDelete}
                        className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                <button 
                    onClick={handleSave}
                    className="flex-1 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all"
                >
                    <Check size={16} /> Save Item
                </button>
            </div>
        </div>
    </div>
  );
};

export default DashboardEntityModal;
