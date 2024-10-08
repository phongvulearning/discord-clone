// // import { useSocket } from "@/providers/socket-provider";
// import { MessageWithMemberWithProfile } from "@/type";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { io } from "socket.io-client";
//
// type ChatSocketProps = {
//   addKey: string;
//   updateKey: string;
//   queryKey: string;
// };
//
// export const useChatSocket = ({
//   addKey,
//   updateKey,
//   queryKey,
// }: ChatSocketProps) => {
//   // const { socket } = useSocket();
//
//   const queryClient = useQueryClient();
//
//   useEffect(() => {
//     // if (!socket) return;
//
//     socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
//       console.log("updateKey", updateKey);
//
//       queryClient.setQueryData([queryKey], (oldData: any) => {
//         if (!oldData || !oldData?.length || oldData?.pages.length === 0) {
//           return oldData;
//         }
//
//         const newData = oldData?.pages?.map((page: any) => {
//           return page?.items?.map((item: any) => {
//             if (item?.id === message?.id) {
//               return message;
//             }
//             return item;
//           });
//         });
//
//         return {
//           ...oldData,
//           pages: newData,
//         };
//       });
//     });
//
//     socket.on(addKey, (message: MessageWithMemberWithProfile) => {
//       console.log("addKey", addKey);
//       queryClient.setQueryData([queryKey], (oldData: any) => {
//         if (!oldData || !oldData?.length || oldData?.pages.length === 0) {
//           return oldData;
//         }
//
//         const newData = [...oldData?.pages];
//
//         newData[0] = {
//           ...newData[0],
//           items: [message, ...newData[0].items],
//         };
//
//         return {
//           ...oldData,
//           pages: newData,
//         };
//       });
//     });
//
//     return () => {
//       socket.off(updateKey);
//       socket.off(addKey);
//     };
//   }, [addKey, queryClient, queryKey, updateKey, socket]);
// };
