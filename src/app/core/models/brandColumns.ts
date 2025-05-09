export const brandColumnObject:any={
    
    "22": { //honda2w
         columns:{
             PO:["order number",'supplier name','order status','purchase order type','part number','quantity requested',
                 'mrns actual received qty','invoiced qty','order date','mrn date','invoice date po',
                 'network code',
             ],
         }
 
     },
     "17": { //tatcv
         columns:{
             PO:["order",'part','recd qty','status','ware house name','payer code',
                 'division name','transaction date','purchaseorderdate','invoicedate','spares order type',
                 'sap order num','commit flag'
             ],
         }
 
     },
     "28": { //tatapc
         columns:{
             PO:["order",'part','recd qty','status','ware house name','payer code',
                 'division name','transaction date','purchaseorderdate','invoicedate','spares order type',
                 'sap order num','commit flag'
             ],
         }
 
     },
     "20": { //hero
         columns:{
             PO:["part number",'purchase order number','order status','order date','invoice date','grn invoice date',
                 'order subtype','order quantity','invoice quantity'
             ],
         }
 
     },
     "12": { //renault
         columns:{
             PO:["supplier type",'po number','order submission date','order sub type','order part number','order quantity',          
             ],
             MRN:['transaction date','supplier invoice date','supplier type','dms order number','part no',
                 'shipped quantity','receipt quantity'
             ]
         }
     },
     "9": { //MAHINDRA
         columns:{
             PO:["po release date",'po type','po status','po number','po group','po line item status',
                 'po rejection reason','part no','so qty'          
             ],
             MRN:['receipt date','invoice date','po number','party type','part number',
                 'received qty','invoice qty'
             ]
         }
     },
     "32": { //JCB
         columns:{
             PO:["branch name",'order no','vendor','order ref no','ordtype','material no',
                 'ord date','ordqty'          
             ],
             MRN:['branch','order no','jcbinvdt','grn date','part code',
                 'qty'
             ]
         }
     },
     "11": { //Hyundai
         columns:{
             PO:["order no",'part no order','part no current','part name','quantity order','quantity current',
                 'po date','pdc'          
             ],
             MRN:['po no','part no','invoice date','gr date','rcv qty',
                 
             ]
         }
     },
     "33": { //Kia
         columns:{
             PO:["order no",'part no order','part no current','part name','quantity order','quantity current',
                 'po date','pdc'          
             ],
             MRN:['po no','part no','invoice date','gr date','rcv qty',
                 
             ]
         }
     },
 
 
 }
 
 //Mahindra mrn is left else all the format has been updated
 // export const brandColumnObject:any={
     
 //        "22": { //honda2w
 //             columns:{
 //                 PO:['Brand','Dealer','Location','Network  Type',	'Network Code',	'Network Name',	'Supplier Type',	'Supplier Name',
 //                     	'Supplier',	'Order Date',	'Order Number',	'Order Status',	'Purchase Order Type',	'HMSI/Non-HMSI',
 //                         	'Part Category',	'Part Number',	'Part Description',	'HSN Code',
 //                             	'Quantity Requested',	'NDP',	'Total PO Amount on NDP',	'Unit Price',	'Total PO Amount on Unit Price',
 //                                 	'MRN Number',	'MRN Date',	'Supplier Invoice Number',	'Supplied Part Number',	'Invoice Date PO',	'MRNs Actual Received Qty',
 //                                     	'MRN Amount',	'Invoiced Qty',	'Invoice Unit Price',	'Pending Quantity',
 //                                         	'Discount Amount',	'CGST %',	'CGST Amount',	'SGST %',
 //                                             	'SGST Amount',	'UTGST %',	'UTGST Amount',	'IGST %',
 //                     'IGST Amount',	'Total Invoice Value',	'Transporter Name',	'Docket Number',	'Other Chargers'
 
 //                 ],
 //             }
     
 //         },
 //         "17": { //tatcv
 //             columns:{
 //                 PO:['Brand','Dealer','Location',"Transaction Number","Order",'Commit Flag',
 //                     	'SAP Invoice',	'Invoice_Date',	'Part',
 //                         	'Recd Qty',	'Status',
 //                             	'Ware House Name',
 //                         	'Condition'	,'Transaction Date',	'Spares Order Type'	,'Vendor Invoice'	,'Net Amount',	'Line Item Invoice Total',
 //                             	'Total_Invoice_Amount',	'Vendor Name',	'Payer Code',	'SAP Order Num',	'IRN',	'IRN Date',
 //                                 	'TCS Amount',	'Cash Discount Percentage',	'Discount Per Part',	'Discount Per Part Percentage',	
 //                                     'Other Charges Amount'	,'Challan',	'Challan Date',	'Challan Quantity','Purchase_Order_Date','GST Invoice',
 //                                     	'Weighted Avg',	'Division Name',	'Cash Discount',	'Discount Amount',	'Order Type',	'VAT',	'CST VAT',
 //                                         	'CST',	'CST Surcharge',	'LST',	'LST Surcharge',	'Additional Tax',	'TOT',	'Octroi','CGST',
 //                                             	'SGST',	'IGST'	,'UTGST','Movement Type'
 
 //                 ],
 //             }
     
 //         },
 //         "28": { //tatapc
 //             columns:{
 //                 PO:['Brand','Dealer','Location','Additional Tax',
 //                     	'Cash Discount',	'Cash Discount Percentage',	'CGST',	'Challan #','Challan Date',
 //                         'Challan Quantity',	'Commit Flag',	'Condition',	'CST',	'CST Surcharge',
 //                         	'CST VAT'	,'Discount Amount',	'Discount Per Part',	
 //                             'Discount Per Part Percentage',	'Division Name',	'GST Invoice #',	'IGST',	'Invoice_Date',	'IRN',	'IRN Date',
 //                             	'Line Item Invoice Total',	'LR #/Docket #',	'LST',	'LST Surcharge',	'Movement Type',	
 //                                 'Net Amount'	,'Octroi',	'Order #',	'Order Type',	'Other Charges Amount',	'Part #',	'Payer Code',	'Purchase_Order_Date',
 //                                 	'Recd Qty',	'SAP Invoice #',	'SAP Order Num',	'SGST',	'Spares Order Type',	'Status','TCS Amount'	,'TOT'
 //                                     ,	'Total_Invoice_Amount',	'Transaction Date',	'Transaction Number',	'UTGST',	'VAT',	'Vendor Invoice #',	'Vendor Name',
 //                                     	'Ware House Name',	'Weighted Avg'
 
 //                 ],
 //             }
     
 //         },
 //         "20": { //hero
 //             columns:{
 //                 PO:['Brand','Dealer','Location','Dealer Name',	'Dealer Code',	'Town Name',
 //                     	'Purchase Order Number',	'Order Date',	'Order Status',
 //                     'Order Subtype',	'Product Category',	'Part Number',	'Product Description',
 //                     	'Order Quantity',	'Order Value',	'Supplier Code',	'Invoice Date',
 //                         	'Invoice Quantity',	'Invoice Value',	'GRN Invoice Number',	'GRN Invoice Date'
 
 //                 ],
 //             }
     
 //         },
 //         "12": { //renault
 //             columns:{
 //                 PO:['Brand','Dealer','Location','Dealer Code',	'Dealer Name',	'Dealer Location',	'Dealer Zone',	'Destination Warehouse',	'Parts Category',	'Parts Segment',
 //                     	'Supplier Type',	'Supplier Code',	'Supplier Name',	'Supplier Location',
 //                         	'PO Number',	'Source Inventory Location',	'DMS Order Number',	'RIPL Order Number',
 //                             	'Order Creation Date',	'Order Submission Date',	'Order Category',	'PO Date',	'Order Sub Type',
 //                                 	'Order Part Number',	'Part Description',	'RO #',	'VIN #',	'Order Quantity',
 //                                     	'Allocated Qty',	'Invoiced Qty',	'In Transit Qty',	'Received Qty',
 //                                         	'Back Order Quantity',	'Back Order Value','No of Days in Back Order',
 //                 	'Cancelled Qty',	'Cancellation Response',	'Dealer Base Price',	'Dealer Landed Price',
 //                     	'Freight + Other Charges',	'Total Value',	'Dealer',	'Location'
          
 //                 ],
 //                 MRN:['Brand','Dealer','Location','Dealer Code',	'Dealer Name',	'Dealer Location',	'Dealer Zone',
 //                     	'Warehouse',	'Parts Category',	'Parts Segment',	'Supplier Type',
 //                         	'GRN Type',	'Transaction No',	'Transaction Date',	'PO Type',	'RO No',	'VIN No',
 //                             	'Supplier Code',	'Supplier Name',	'Supplier Location',	'Supp PO Number / Stock Transfer No',
 //                                 	'DMS Order Number',	'Supp Invoice No / Document No',	'Supplier Invoice Date',
 //                                     	'Shipped Quantity',	'Material Value (NDP)',	'Excise Value',	'CST Amount',
                                         
 //                                         'Secondary Cess Amount',	'Freight Amount',	'EducationalCess Amount',	'VAT Amount',	'Other Charges',
 //                                         	'CESS Amount','CGST Amount',	'SGST Amount',	'IGST Amount',	'UTGST Amount',	'GST Amount',	'TCS Amount',	'Total Bill Amount',	'Discount',	'Part No',	'Part Description',	'HSN Code',
 //                                             	'Receipt Quantity',	'Purchase price (LC) per pc',	'Final Receipt Value'	,
 //                                                 'Value of Goods (inc freight & other charges)',	'NDP'
 
 //                 ]
 //             }
 //         },
 //         "9": { //MAHINDRA
 //             columns:{
 //                 PO:["Brand",	"dealer",	"location",	"Po Number",	"Po Date",	"Po Release Date",
 //                     	"Created By",	"Po Status",	"Supplier Name",	"Supplier GSTIN No.",
 //                         	"Supplier State Code",	"Po Group",	"Vehicle Status",	"Po Type",	"OEM Order No",
 //                             	"OEM Order Date",	"Part No.",	"Description",	"HSN",	"Po line item status",
 //                                 	"PO qty.",	"Initial Entered Qty",	"Per Vehicle Qty",	"SO qty.",
 //                                     "BO qty.",	"Received qty.","NDP/unit",	"Value (GNDP*PO qty)",
 //                                     	"Part Category Description",	"RO Location",	"RO Number",	"Chassis no	Model",	"Plant",	"Product division",
 //                                         	"Dealer code",	"Auto_Generated_PO",	"PO Rejection Reason",	"CM Action Flag",	"PO Remark",	
 //                                             "SAP Inv No",	"SAP Inv Date",	"Key No YSKY"
          
 //                 ],
 //                 MRN:["Brand","Dealer","Location"
 //                 ]
 //             }
 //         },
 //         "32": { //JCB
 //             columns:{
 //                 PO:["Brand","Dealer","Location","Branch Name",	"Order Ref No",	"Ord.Type",	"Order No",	"Ord. Date",
 //                     	"Vendor",	"Mat. Group",	"Material No",	"Material Desc",	"OrdQty",	"DNP",	"DNP Val",
 //                         	"Service Call ID",	"Machine No"
         
 //                 ],
 //                 MRN:["Brand","Dealer","Location","Branch",	"Ven. Code","Vendor Name",	"Plant",	"PO Type",	"Order No",
 //                     	"Order Date",	"OrdRefNo",	"OrdQty",	"Excise Inv No",	"Jcb Inv No",	"JcbInvDt",	"GRN No",
 //                         	"GRN Date",	"Item Grp","BHLHLN",	"Part Code",	"Part Description",	"Bin Loc.",	"Qty",	"DNP",	"DNPVAL",
 //                             	"ED",	"EDVAL","DNP ED VAL",	"Disc %",	"Disc Amt",	"TaxCode",	"Tax Amt",	"VAT",	"CST",
 //                                 	"Freight",	"VorSc","Cash Dis",	"Ord Disc",	"Pack & Frwd",	"Spl. Disc",	"Schm Disc",
 //                                     	"Mrp Eq",	"Inv Sub Total",	"Total Expns",	"Total Tax"	,"Inv Total",	"U_SRNOL",	"U_MACNNOL"
 
 //                 ]
 //             }
 //         },
 //         "11": { //Hyundai
 //             columns:{
 //                 PO:["Brand","Dealer","Location","ORDER NO",	"LINE",	"PART NO ORDER","PART NO CURRENT",		"PART NAME",	"PART SOURCE",	"QUANTITY ORDER",
 //                     "QUANTITY CURRENT","B/O",	"PO DATE",	"PDC",	"ETA",	"MSG",	"PROCESSING ALLOCATION",
 //                     "PROCESSING ON-PICK","PROCESSING ON-PACK","PROCESSING PACKED","PROCESSING INVOICE","PROCESSING SHIPPED",
 //                     "LOST QTY","ELAP"]
 //     ,
 //                 MRN:["Brand","Dealer","Location","SEQ",	"Invoice No",	"Invoice Date",	"Supplier",	"PO No",	"GR No"	,"GR Type"	,"GR Date",
 //                     	"LS/OS Type",	"HSN CD",	"GSTNO",	"RATE(%)",	"UQC","Place of supply",	"Part No",
 //                         	"Part Name",	"Part Type",	"Model",	"Source",	"RCV QTY",	"List Price",	"NDP",	"Material Value",
 //                             	"VSC",	"DSC",	"Sales Tax Amt",	"Freight","Insurance",	"TXBL AMOUNT",	"SGST",	"CGST",	"IGST",
 //                                 	"LDC",	"Total ED Value"
 //                 ]
 //             }
 //         },
 //         "33": { //Kia
 //             columns:{
 //                 PO:["Brand","Dealer","Location","ORDER NO",	"LINE",	"PART NO ORDER","PART NO CURRENT",		"PART NAME",	"PART SOURCE",	"QUANTITY ORDER",
 //                     "QUANTITY CURRENT","B/O",	"PO DATE",	"PDC",	"ETA",	"MSG",	"PROCESSING ALLOCATION",
 //                     "PROCESSING ON-PICK","PROCESSING ON-PACK","PROCESSING PACKED","PROCESSING INVOICE","PROCESSING SHIPPED",
 //                     "LOST QTY","ELAP"]
 //     ,
 //                 MRN:["Brand","Dealer","Location","SEQ",	"Invoice No",	"Invoice Date",	"Supplier",	"PO No",	"GR No"	,"GR Type"	,"GR Date",
 //                     	"LS/OS Type",	"HSN CD",	"GSTNO",	"RATE(%)",	"UQC","Place of supply",	"Part No",
 //                         	"Part Name",	"Part Type",	"Model",	"Source",	"RCV QTY",	"List Price",	"NDP",	"Material Value",
 //                             	"VSC",	"DSC",	"Sales Tax Amt",	"Freight","Insurance",	"TXBL AMOUNT",	"SGST",	"CGST",	"IGST",
 //                                 	"LDC",	"Total ED Value"
 //                 ]
 //             }
 //         },
     
     
 //     }