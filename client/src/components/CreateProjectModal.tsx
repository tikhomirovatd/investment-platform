import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertProject } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Extend the insert schema with validation
const projectFormSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  dealType: z.enum(["SALE", "INVESTMENT"]),
  industry: z.string().min(1, { message: "Industry is required" }),
  isVisible: z.boolean().default(true),
  isCompleted: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const industries = [
    "IT", 
    "Food & Beverage", 
    "Agriculture", 
    "Chemical Industry", 
    "Pharmaceuticals", 
    "Electronics", 
    "Food Service", 
    "Confectionery"
  ];

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      dealType: "SALE",
      industry: "",
      isVisible: true,
      isCompleted: false,
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject: InsertProject) => 
      apiRequest("POST", "/api/projects", newProject)
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      onSuccess();
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый проект</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название проекта</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название проекта" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип сделки</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип сделки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SALE">Продажа</SelectItem>
                      <SelectItem value="INVESTMENT">Инвестиции</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отрасль</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите отрасль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Видимый проект</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                className="bg-[#3498DB] hover:bg-[#2980b9]"
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
