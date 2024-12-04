// 'use client';

// import { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { PlusCircle, Trash2 } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast"
// import { cn, formatCurrency, formatDate } from '@/lib/utils';
// import { addExpense, deleteExpense } from '@/app/actions/expenses'; // Assuming this is where your server action is
// import { Checkbox } from '@radix-ui/react-checkbox';

// export function SplitExpenseList({ expenses, setTrip, participants, tripId, setRefreshTrip }: any) {
//   const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
//   const [newExpense, setNewExpense] = useState({
//     title: '',
//     amount: 0,
//     category: '',
//   });
//   const [processing, setProcessing] = useState(false)
//   const [openDialog, setOpenDialog] = useState(false);
//   const [expenseOpenDialog, setExpenseOpenDialog] = useState(false);
//   const { toast } = useToast()

//   const handleDialogOpen = () => {
//     // Set all participants as selected by default
//     setSelectedParticipants(participants.map((p: any) => p.id));
//   };

//   const handleAddExpense = async () => {
//     setProcessing(true)
//     const payload = {
//       ...newExpense,
//       userIds: participants.map((p: any) => p.id),
//       date: new Date(Date.now()),
//       tripId
//     }
//     try {
//       const { expense } = await addExpense(payload);  // Get the new expense from server action
//       setTrip((prevTrip: any) => ({
//         ...prevTrip,  // Spread the existing state to keep other keys
//         expenses: [...prevTrip.expenses, expense]  // Update only the expenses key
//       }));
//       toast({
//         title: "Expense Added Successfully",
//         description: "Your expense has been successfully added to the trip.",
//       })      
//     } catch (error) {
//       toast({
//         title: "Expense Addition Failed",
//         description: "There was an issue while adding the expense. Please try again later.",
//       })      
//       console.error("Error adding expense:", error);
//     } finally {
//       setProcessing(false);
//       setExpenseOpenDialog(false);
//       setNewExpense({ title: '', amount: 0, category: '' });
//       setSelectedParticipants([]);
//       setRefreshTrip((prev:any)=>!prev)
//     }
//   };

//   async function handleDeleteExpense(id: string) {
//     setProcessing(true);  // Start the processing state
//     try {
//       await deleteExpense(id);
//       setTrip((prevTrip: any) => ({
//         ...prevTrip,  // Spread the existing trip object
//         expenses: prevTrip.expenses.filter((expense: any) => expense.id !== id)
//       }));
//       toast({
//         title: "Expense Deleted Successfully",
//         description: "Your expense has been successfully deleted from the trip.",
//       }) 
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast({
//         title: "Expense Deletion Failed",
//         description: "There was an issue while deleting the expense. Please try again later.",
//       })  
//     } finally {
//       setProcessing(false);
//       setOpenDialog(false);
//       setRefreshTrip((prev:any)=>!prev)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <CardTitle>Splits</CardTitle>
//           <Dialog open={expenseOpenDialog} onOpenChange={setExpenseOpenDialog} >
//             <DialogTrigger asChild>
//               <Button className="w-full sm:w-auto">
//                 <PlusCircle className="w-4 h-4 mr-2" />
//                 Add Split
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Expense</DialogTitle>
//                 <DialogDescription>
//                   Add a new expense and split it among participants.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     placeholder="Dinner at Restaurant"
//                     value={newExpense.title}
//                     onChange={(e) =>
//                       setNewExpense({ ...newExpense, title: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="amount">Amount</Label>
//                   <Input
//                     id="amount"
//                     type="number"
//                     placeholder="0.00"
//                     value={newExpense.amount}
//                     onChange={(e) =>
//                       setNewExpense({
//                         ...newExpense,
//                         amount: parseFloat(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="category">Category</Label>
//                   <Select
//                     value={newExpense.category}
//                     onValueChange={(value) =>
//                       setNewExpense({ ...newExpense, category: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue
//                         placeholder="Select category"
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="food">Food</SelectItem>
//                       <SelectItem value="transport">Transportation</SelectItem>
//                       <SelectItem value="accommodation">
//                         Accommodation
//                       </SelectItem>
//                       <SelectItem value="activities">Activities</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label>Split with</Label>
//                   <div className="space-y-2 max-h-[200px] overflow-y-auto">
//                     {participants?.map((participant: any) => (
//                       <div
//                         key={participant.id}
//                         className="flex items-center space-x-2"
//                       >
//                         <Checkbox
//                           id={`participant-${participant.id}`}
//                           checked={selectedParticipants.includes(participant.id)}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               setSelectedParticipants([
//                                 ...selectedParticipants,
//                                 participant.id,
//                               ]);
//                             } else {
//                               setSelectedParticipants(
//                                 selectedParticipants.filter(
//                                   (id) => id !== participant.id
//                                 )
//                               );
//                             }
//                           }}
//                         />
//                         <Label
//                           htmlFor={`participant-${participant.id}`}
//                           className="flex items-center"
//                         >
//                           <Avatar className="h-6 w-6 mr-2">
//                             <AvatarImage src={participant.avatar} />
//                             <AvatarFallback>
//                               {participant.name[0]}
//                             </AvatarFallback>
//                           </Avatar>
//                           {participant.viewName}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit" onClick={handleAddExpense}>
//                   {processing ? <div className='flex justify-center'><svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className={cn("animate-spin")}
//                   >
//                     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//                   </svg></div> : "Add Expense"}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {expenses?.length > 0 ? (
//           <div className="space-y-4">
//             {expenses.map((expense: any) => (
//               <div
//                 key={expense.id}
//                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4"
//               >
//                 <div className="flex items-center space-x-4">
//                   <Avatar>
//                     <AvatarImage
//                       src={expense?.user?.avatar}
//                     />
//                     {/* <AvatarFallback>{expense.creatorName[0]}</AvatarFallback> */}
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{expense.title}</p>
//                     <p className="text-sm text-muted-foreground">
//                       Added by {expense.user?.viewName} • {expense?.category} • {formatDate(expense?.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
//                   <p className="font-semibold">
//                     {formatCurrency(expense.amount)}
//                   </p>
//                   <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
//                     <AlertDialogTrigger><Trash2 className="h-4 w-4" /></AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This action cannot be undone. This will permanently delete this expense.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)}>
//                           {processing ? <div className='flex justify-center'><svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className={cn("animate-spin")}
//                           >
//                             <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//                           </svg></div> : "Delete"}
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No expenses yet.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }