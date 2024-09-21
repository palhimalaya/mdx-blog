"use client";

import React from "react";
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
} from "@/components/ui/dialog"

import { formatDate } from '@/lib/utils';
import { EditIcon, DeleteIcon } from 'lucide-react'; // Import Lucid React icons

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (post: TData) => {
    // Handle edit action
    console.log('Edit post:', post)
  };

  const handleDelete = (post: TData) => {
    // Handle delete action
    console.log('Delete post:', post);
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
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger>
                              <EditIcon />
                            </DialogTrigger>
                            <DialogContent>
                              
                            </DialogContent>
                          </Dialog>
                          <button onClick={() => handleEdit(row.original)}>
                            <EditIcon />
                          </button>
                          <button onClick={() => handleDelete(row.original)}>
                            <DeleteIcon />
                          </button>
                        </div>
                      )
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
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