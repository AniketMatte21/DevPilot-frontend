// import {
//   ArrowUp,
//   Square,
// } from "lucide-react";

// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";


// const ChatInput = ({
//   onSend,
//   onStop,
//   streaming,
// }) => {

//   const [value, setValue] =
//     useState("");


//   const submit = () => {

//     if (
//       !value.trim() ||
//       streaming
//     ) {
//       return;
//     }

//     onSend(value);

//     setValue("");
//   };


//   const handleKeyDown = (event) => {

//     if (
//       event.key === "Enter" &&
//       !event.shiftKey
//     ) {

//       event.preventDefault();

//       submit();
//     }
//   };


//   return (

//     <div
//       className="
//         shrink-0
//         border-t
//         bg-background
//         p-4
//       "
//     >

//       <div
//         className="
//           mx-auto
//           w-full
//           max-w-4xl
//         "
//       >

//         <div
//           className="
//             relative
//             rounded-2xl
//             border
//             bg-background
//             shadow-sm
//             focus-within:ring-1
//             focus-within:ring-ring
//           "
//         >

//           <Textarea
//             value={value}
//             onChange={(event) =>
//               setValue(
//                 event.target.value
//               )
//             }
//             onKeyDown={
//               handleKeyDown
//             }
//             placeholder={
//               "Ask anything about your repository..."
//             }
//             disabled={streaming}
//             rows={1}
//             className="
//               min-h-[52px]
//               resize-none
//               border-0
//               bg-transparent
//               px-4
//               py-4
//               pr-14
//               shadow-none
//               focus-visible:ring-0
//             "
//           />


//           <div
//             className="
//               absolute
//               bottom-2
//               right-2
//             "
//           >

//             {streaming ? (

//               <Button
//                 type="button"
//                 size="icon"
//                 variant="outline"
//                 onClick={onStop}
//                 className="rounded-xl"
//               >

//                 <Square
//                   className="
//                     h-4
//                     w-4
//                     fill-current
//                   "
//                 />

//               </Button>

//             ) : (

//               <Button
//                 type="button"
//                 size="icon"
//                 onClick={submit}
//                 disabled={
//                   !value.trim()
//                 }
//                 className="rounded-xl"
//               >

//                 <ArrowUp
//                   className="h-4 w-4"
//                 />

//               </Button>

//             )}

//           </div>

//         </div>


//         <p
//           className="
//             mt-2
//             text-center
//             text-[11px]
//             text-muted-foreground
//           "
//         >
//           AI can make mistakes. Verify important
//           code before using it.
//         </p>

//       </div>

//     </div>
//   );
// };


// export default ChatInput;