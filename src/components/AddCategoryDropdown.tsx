import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import { categoriesCollection } from "#/db-collections/categories";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";

interface Props {
	parentCategoryId?: string;
}

export default function AddCategoryDropdown({ parentCategoryId }: Props) {
	const [open, setOpen] = useState(false);

	const categoryForm = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			categoriesCollection.insert({
				id: crypto.randomUUID(),
				name: value.name,
				parentId: parentCategoryId ? parentCategoryId : null,
				createdAt: null,
			});
		},
	});

	return (
		<span className="ml-auto">
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<Plus className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						{parentCategoryId ? "Add sub-category" : "Add category"}
					</DropdownMenuLabel>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							categoryForm.handleSubmit();
						}}
					>
						<FieldSet>
							<FieldGroup>
								<categoryForm.Field
									name="name"
									validators={{
										onChange: ({ value }) => {
											!value ? "Name cannot be empty" : undefined;
										},
									}}
								>
									{(field) => {
										return (
											<Field>
												<FieldLabel htmlFor={field.name}>
													Category Name
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="off"
												/>
												<FieldDescription>Name of category.</FieldDescription>
											</Field>
										);
									}}
								</categoryForm.Field>
								<categoryForm.Subscribe
									selector={(state) => [state.canSubmit, state.isSubmitting]}
								>
									{([canSubmit, isSubmitting]) => (
										<div className="">
											<Button
												type="submit"
												disabled={!canSubmit}
												onClick={() => setOpen(false)}
											>
												{isSubmitting ? "..." : "Submit"}
											</Button>
											<Button
												type="reset"
												onClick={(e) => {
													e.preventDefault();
													categoryForm.reset();
												}}
											>
												Reset
											</Button>
										</div>
									)}
								</categoryForm.Subscribe>
							</FieldGroup>
						</FieldSet>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>
		</span>
	);
}
