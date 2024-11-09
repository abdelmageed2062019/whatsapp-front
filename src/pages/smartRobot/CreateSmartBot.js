// import React, { useState } from "react";
// import Select from "react-select";

// const BotResponseCreator = () => {
//   const [responseType, setResponseType] = useState("list");
//   const [listTitle, setListTitle] = useState("عنوان الاقائمة");
//   const [sections, setSections] = useState([
//     {
//       title: "عنوان القسم",
//       options: [
//         {
//           title: "خيار",
//           type: "buttons",
//           buttons: [{ title: "اسم زر", action: "openWebLink", url: "" }],
//         },
//         {
//           title: "خيار اخر",
//           type: "list",
//           subList: { title: "عنوان قائمه 2", sections: [] },
//         },
//       ],
//     },
//     {
//       title: "",
//       options: [],
//     },
//   ]);

//   const responseTypes = [
//     { value: "normal", label: "رسالة عادية" },
//     { value: "list", label: "قائمة" },
//     { value: "buttons", label: "أزرار" },
//   ];

//   const optionTypes = [
//     { value: "buttons", label: "أزرار" },
//     { value: "list", label: "قائمة" },
//   ];

//   const handleAddSection = () => {
//     setSections([...sections, { title: "", options: [] }]);
//   };

//   const handleAddOption = (sectionIndex) => {
//     const newSections = [...sections];
//     newSections[sectionIndex].options.push({
//       title: "خيار جديد",
//       type: "buttons",
//       buttons: [],
//     });
//     setSections(newSections);
//   };

//   const handleRemoveSection = (index) => {
//     const newSections = sections.filter((_, i) => i !== index);
//     setSections(newSections);
//   };

//   const handleRemoveOption = (sectionIndex, optionIndex) => {
//     const newSections = [...sections];
//     newSections[sectionIndex].options = newSections[
//       sectionIndex
//     ].options.filter((_, i) => i !== optionIndex);
//     setSections(newSections);
//   };

//   const handleSectionTitleChange = (index, value) => {
//     const newSections = [...sections];
//     newSections[index].title = value;
//     setSections(newSections);
//   };

//   const handleOptionTitleChange = (sectionIndex, optionIndex, value) => {
//     const newSections = [...sections];
//     newSections[sectionIndex].options[optionIndex].title = value;
//     setSections(newSections);
//   };

//   const handleOptionTypeChange = (sectionIndex, optionIndex, value) => {
//     const newSections = [...sections];
//     newSections[sectionIndex].options[optionIndex].type = value;
//     if (value === "buttons") {
//       newSections[sectionIndex].options[optionIndex].buttons = [
//         { title: "زر جديد", action: "openWebLink", url: "" },
//       ];
//     } else if (value === "list") {
//       newSections[sectionIndex].options[optionIndex].subList = {
//         title: "عنوان قائمة فرعية",
//         sections: [],
//       };
//     }
//     setSections(newSections);
//   };

//   return (
//     <div className="bot-response-creator">
//       <Select
//         options={responseTypes}
//         value={responseTypes.find((type) => type.value === responseType)}
//         onChange={(selected) => setResponseType(selected.value)}
//       />

//       <div className="list">
//         <input
//           type="text"
//           value={listTitle}
//           onChange={(e) => setListTitle(e.target.value)}
//           placeholder="عنوان القائمة"
//         />

//         {sections.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="section">
//             <input
//               type="text"
//               value={section.title}
//               onChange={(e) =>
//                 handleSectionTitleChange(sectionIndex, e.target.value)
//               }
//               placeholder="عنوان القسم"
//             />
//             <button onClick={() => handleRemoveSection(sectionIndex)}>
//               حذف القسم
//             </button>

//             {section.options.map((option, optionIndex) => (
//               <div key={optionIndex} className="option">
//                 <input
//                   type="text"
//                   value={option.title}
//                   onChange={(e) =>
//                     handleOptionTitleChange(
//                       sectionIndex,
//                       optionIndex,
//                       e.target.value
//                     )
//                   }
//                   placeholder="اسم الخيار"
//                 />
//                 <Select
//                   options={optionTypes}
//                   value={optionTypes.find((type) => type.value === option.type)}
//                   onChange={(selected) =>
//                     handleOptionTypeChange(
//                       sectionIndex,
//                       optionIndex,
//                       selected.value
//                     )
//                   }
//                 />
//                 <button
//                   onClick={() => handleRemoveOption(sectionIndex, optionIndex)}
//                 >
//                   حذف الخيار
//                 </button>

//                 {option.type === "buttons" && (
//                   <div className="buttons">
//                     {/* Add button creation logic here */}
//                   </div>
//                 )}

//                 {option.type === "list" && (
//                   <div className="sub-list">
//                     {/* Add sub-list creation logic here */}
//                   </div>
//                 )}
//               </div>
//             ))}

//             <button onClick={() => handleAddOption(sectionIndex)}>
//               إضافة خيار
//             </button>
//           </div>
//         ))}

//         <button onClick={handleAddSection}>إضافة قسم</button>
//       </div>
//     </div>
//   );
// };

// export default BotResponseCreator;
