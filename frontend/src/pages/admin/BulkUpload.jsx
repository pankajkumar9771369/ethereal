import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Papa from 'papaparse';
import { ChevronLeft, UploadCloud } from 'lucide-react';

const BulkUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [file, setFile] = useState(null);
  const [detectedHeaders, setDetectedHeaders] = useState([]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: function(header) {
          const h = header.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const headerMap = {
            'name': 'name', 'title': 'name', 'productname': 'name', 'productn': 'name',
            'image': 'image', 'img': 'image', 'imageurl': 'image', 'imageuri': 'image', 'imageur': 'image',
            'description': 'description', 'desc': 'description', 'descriptio': 'description',
            'category': 'category', 'type': 'category',
            'price': 'price', 'cost': 'price',
            'compareprice': 'comparePrice', 'compareatprice': 'comparePrice', 'compare': 'comparePrice',
            'countinstock': 'countInStock', 'stock': 'countInStock', 'inventory': 'countInStock', 'quantity': 'countInStock', 'qty': 'countInStock', 'stockcount': 'countInStock', 'stockcou': 'countInStock', 'stockcoun': 'countInStock',
            'volume': 'volume', 'size': 'volume',
            'benefits': 'benefits', 'features': 'benefits'
          };
          return headerMap[h] || header.trim();
        },
        complete: function(results) {
          setDetectedHeaders(results.meta.fields || []);
          setParsedData(results.data);
        },
        error: function(err) {
          setError('Failed to parse CSV file: ' + err.message);
        }
      });
    }
  };

  const processBulkUpload = async () => {
    if (parsedData.length === 0) {
      setError('No valid data found in CSV.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Map flat CSV data to our model schema
      const formattedProducts = parsedData.map(row => ({
        name: row.name,
        image: row.image,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        comparePrice: row.comparePrice ? Number(row.comparePrice) : undefined,
        countInStock: Number(row.countInStock),
        volume: row.volume || '',
        benefits: row.benefits ? row.benefits.split(',').map(b => b.trim()) : []
      }));

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/products/bulk`, { products: formattedProducts }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(`Successfully imported ${data.count} products!`);
      setParsedData([]);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/admin" className="text-slate/60 hover:text-primary flex items-center text-sm uppercase tracking-wider transition-colors mb-4">
            <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-light text-slate">Bulk Product Upload</h1>
          <p className="text-slate/60 mt-2">Upload a CSV file to instantly populate your catalog.</p>
        </div>

        <div className="bg-white p-8 shadow-sm border border-sage/20">
          {error && <div className="bg-red-50 text-red-500 p-4 mb-6 border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 mb-6 border border-green-100">{success}</div>}

          <div className="border-2 border-dashed border-sage/40 rounded-lg p-12 text-center bg-cream/30">
             <UploadCloud size={48} className="mx-auto text-sage mb-4" />
             <h3 className="text-lg font-medium text-slate mb-2">Upload CSV File</h3>
             <p className="text-slate/60 text-sm mb-6 max-w-md mx-auto">
               Your CSV must include headers: name, image, description, category, price, countInStock, comparePrice (optional), volume, benefits.
             </p>
             
             <input 
               type="file" 
               accept=".csv"
               id="csvUpload"
               className="hidden"
               onChange={handleFileUpload}
             />
             <label htmlFor="csvUpload" className="cursor-pointer bg-white border border-slate text-slate px-6 py-3 uppercase tracking-widest text-sm hover:bg-slate hover:text-cream transition-colors">
                Select File
             </label>
             {file && <p className="mt-4 text-sm text-earth font-medium">Selected: {file.name}</p>}
             {detectedHeaders.length > 0 && (
               <div className="mt-4 bg-white/50 p-4 rounded text-left border border-sage/20 inline-block text-sm">
                 <p className="font-medium text-slate mb-1 text-center">Detected Columns:</p>
                 <p className="text-slate/70 text-center">{detectedHeaders.join(', ')}</p>
               </div>
             )}
          </div>

          {parsedData.length > 0 && (
            <div className="mt-8 pt-8 border-t border-sage/20">
               <h3 className="font-medium text-slate mb-4">Preview ({parsedData.length} items found)</h3>
               <div className="overflow-x-auto mb-6">
                 <table className="min-w-full text-left text-sm">
                   <thead className="bg-slate/5 text-slate/70 uppercase tracking-wider text-xs border-b border-sage/20">
                     <tr>
                       <th className="px-4 py-3">Name</th>
                       <th className="px-4 py-3">Category</th>
                       <th className="px-4 py-3">Price</th>
                       <th className="px-4 py-3">Stock</th>
                     </tr>
                   </thead>
                   <tbody>
                     {parsedData.slice(0, 5).map((row, i) => (
                       <tr key={i} className="border-b border-sage/10 last:border-0 hover:bg-cream/50">
                         <td className="px-4 py-3 font-medium text-slate">{row.name}</td>
                         <td className="px-4 py-3 text-slate/80">{row.category}</td>
                         <td className="px-4 py-3 text-slate/80">${row.price}</td>
                         <td className="px-4 py-3 text-slate/80">{row.countInStock}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {parsedData.length > 5 && (
                   <p className="text-xs text-center text-slate/50 mt-4 italic">+ {parsedData.length - 5} more items</p>
                 )}
               </div>
               
               <button 
                 onClick={processBulkUpload} 
                 disabled={loading}
                 className="w-full bg-slate text-cream py-4 uppercase tracking-widest text-sm hover:bg-sage transition-colors"
               >
                 {loading ? 'Processing...' : `Import ${parsedData.length} Products`}
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BulkUpload;
