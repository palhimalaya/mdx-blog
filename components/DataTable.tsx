'use client';

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { formatDate } from '@/lib/utils';
import { EditIcon, DeleteIcon } from 'lucide-react'; // Import Lucid React icons
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface BaseData {
  id: number;
  title: string;
  content: string;
  summary: string;
  image: string;
  slug: string;
  author: string;
  created_at: string;
}

interface DataTableProps<TData extends BaseData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (data: TData) => Promise<void>;
}

export function DataTable<TData extends BaseData, TValue>({
  columns,
  data,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = async (data: TData) => {
      await onDelete(data);
      setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full rounded-md border">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === 'created_at'
                      ? formatDate(cell.getValue() as string)
                      : cell.column.id === 'actions'
                      ? (
                        <div className="flex space-x-2 justify-end">
                         <Link href={`/admin/posts/edit/${row.original.id}`}>
                          <Button className="bg-blue-500 hover:bg-blue-700 text-white">
                            <EditIcon />
                          </Button>
                        </Link>
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={() => setIsDeleteDialogOpen(true)}>
                                <DeleteIcon />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this item?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="destructive" onClick={() => handleDelete(row.original)}>
                                  Confirm
                                </Button>
                                <Button variant="outline" onClick={()=> setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )
                      : cell.column.id === 'image'?
                      <Image 
                        src={cell.getValue() as string} 
                        alt="item image" 
                        className="h-10 w-10 object-cover rounded-full"
                        width={40}
                        height={40}
                      />
                      : flexRender(cell.column.columnDef.cell, cell.getContext())
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}