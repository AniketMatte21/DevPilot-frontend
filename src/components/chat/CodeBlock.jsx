// import {
//   Check,
//   Copy,
// } from "lucide-react";

// import { useState } from "react";

// import { Button } from "@/components/ui/button";


// const CodeBlock = ({
//   code,
//   language,
// }) => {

//   const [copied, setCopied] =
//     useState(false);


//   const handleCopy = async () => {

//     try {

//       await navigator.clipboard.writeText(
//         code
//       );

//       setCopied(true);

//       setTimeout(() => {
//         setCopied(false);
//       }, 1800);

//     } catch (error) {

//       console.error(
//         "Copy failed:",
//         error
//       );

//     }
//   };


//   return (

//     <div
//       className="
//         overflow-hidden
//         rounded-xl
//         border
//         bg-muted/40
//       "
//     >

//       {/* Code header */}

//       <div
//         className="
//           flex
//           items-center
//           justify-between
//           border-b
//           bg-muted/70
//           px-3
//           py-2
//         "
//       >

//         <span
//           className="
//             text-xs
//             font-medium
//             text-muted-foreground
//           "
//         >
//           {language}
//         </span>


//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           onClick={handleCopy}
//           className="
//             h-7
//             gap-1.5
//             text-xs
//           "
//         >

//           {copied ? (

//             <>
//               <Check className="h-3.5 w-3.5" />
//               Copied
//             </>

//           ) : (

//             <>
//               <Copy className="h-3.5 w-3.5" />
//               Copy
//             </>

//           )}

//         </Button>

//       </div>


//       {/* Code */}

//       <pre
//         className="
//           overflow-x-auto
//           p-4
//           text-xs
//           leading-6
//           md:text-sm
//         "
//       >

//         <code>
//           {code}
//         </code>

//       </pre>

//     </div>
//   );
// };


// export default CodeBlock;