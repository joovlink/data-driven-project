"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { CalendarIcon, FileUser, Upload, User2 } from "lucide-react";
import { DatePicker } from "../ui/date-picker";

const formSchema = z.object({
  first_name: z.string().min(1, "First name required"),
  mid_name: z.string().optional(),
  last_name: z.string().min(1, "Last name required"),
  phone_number: z.string().optional(),
  birth_date: z.string().optional(),
  country: z.string().optional(),
  province_id: z.string().optional(),
  city_id: z.string().optional(),
  description: z.string().min(20, "Min 20 characters").optional(),
  profile_picture: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data?: FormValues) => void;
  initialData?: Partial<FormValues>;
};

export default function GeneralInfoModal({ open, onOpenChange, onSuccess, initialData }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "Indonesia",
    },
  });

  const country = useWatch({ control, name: "country" });
  const provinceID = useWatch({ control, name: "province_id" });

  const rawCountries = useMemo(() => countryList().getData(), []);
  const sortedCountries = useMemo(
    () => [{ label: "Indonesia", value: "ID" }, ...rawCountries.filter((c) => c.label !== "Indonesia")],
    [rawCountries]
  );

  // Reset form setiap kali modal open
  useEffect(() => {
    if (open) {
      reset({
        first_name: initialData?.first_name || "",
        mid_name: initialData?.mid_name || "",
        last_name: initialData?.last_name || "",
        phone_number: initialData?.phone_number || "",
        birth_date: initialData?.birth_date || "",
        country: initialData?.country || "Indonesia",
        province_id: initialData?.province_id || "",
        city_id: initialData?.city_id || "",
        description: initialData?.description || "",
        profile_picture: initialData?.profile_picture || undefined,
      });
      setPreview(typeof initialData?.profile_picture === "string" ? initialData?.profile_picture : null);
    } else {
      setPreview(null);
    }
  }, [open, reset, initialData]);

  // Fetch provinces when Indonesia
  useEffect(() => {
    if (!open) return;
    if (country === "Indonesia") {
      fetch("/data/provinces.json")
        .then((res) => res.json())
        .then((prov) => setProvinces(prov))
        .catch(() => toast.error("Failed to load provinces"));
    } else {
      setProvinces([]);
      setCities([]);
    }
  }, [open, country]);

  // Fetch cities when province selected
  useEffect(() => {
    if (!open) return;
    if (country === "Indonesia" && provinceID) {
      fetch(`/data/regencies/regencies_${provinceID}.json`)
        .then((res) => res.json())
        .then((regs) => setCities(regs))
        .catch(() => toast.error("Failed to load cities"));
    } else {
      setCities([]);
    }
  }, [open, country, provinceID]);

  const formatName = (str: string) => {
    const raw = str.toLowerCase();
    if (raw.startsWith("dki")) return "DKI Jakarta";
    if (raw.startsWith("di y")) return "DI Yogyakarta";
    return raw
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const onSubmit = async (data: FormValues) => {
    if (country === "Indonesia" && (!data.province_id || !data.city_id)) {
      toast.error("Select province and city first!");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Submitted payload:", data);
      await new Promise((r) => setTimeout(r, 700));
      toast.success("General info saved!");
      onSuccess?.(data);
      onOpenChange(false);
    } catch {
      toast.error("Failed to save info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-3 border-b">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <User2 className="w-5 h-5" />
              General Information
            </DialogTitle>
          </DialogHeader>

          <form
            id="general-info-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col max-h-[310px] overflow-y-auto px-6 py-6 space-y-2"
          >
            {/* Foto + Nama */}
            <div className="flex space-x-6">
              {/* Profile Picture */}
              <div className="flex flex-col">
                <Label>Profile Picture</Label>
                <label className="mt-2 w-32 aspect-[3/4] border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer text-sm text-gray-500 hover:border-gray-400 overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-1" />
                      <span>Max 2MB JPEG/PNG</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setValue("profile_picture", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Nama + Birthdate + Phone */}
              <div className="w-full col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <div>
                  <Label>First Name</Label>
                  <Input {...register("first_name")} placeholder="e.g., Joko" />
                  {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label>Mid Name</Label>
                  <Input {...register("mid_name")} placeholder="e.g., Mulyono" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input {...register("last_name")} placeholder="e.g., Widodo" />
                  {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
                </div>

                {/* Birth Date + Phone → satu baris */}
                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                  <div>
                    <Label>Birth Date</Label>
                    <Controller
                      control={control}
                      name="birth_date"
                      render={({ field }) => {
                        const rawValue = field.value;

                        // Convert ke format yang lebih enak dibaca
                        const displayValue = rawValue
                          ? new Date(rawValue).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long", // "March"
                              year: "numeric",
                            })
                          : "";

                        return (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                              <CalendarIcon className="w-4 h-4" />
                            </span>

                            {/* input asli → textnya invisible tapi masih bisa klik datepicker */}
                            <input
                              type="date"
                              value={rawValue || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-transparent"
                            />

                            {/* overlay tampilan yang rapi */}
                            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-black pointer-events-none">
                              {displayValue || "DD/MM/YYYY"}
                            </span>
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Controller
                      name="phone_number"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          country={"id"}
                          value={field.value || ""}
                          onChange={(val: string) => field.onChange(val)}
                          inputClass="!w-full !h-[38px] !text-sm !rounded-md !bg-white !border !border-gray-300 !pl-12 !pr-3"
                          buttonClass="!bg-white !border-r !border-gray-300 !rounded-l-md"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Country / Province / City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("province_id", "");
                        setValue("city_id", "");
                        setCities([]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCountries.map((c) => (
                          <SelectItem key={c.value} value={c.label}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Province</Label>
                {country === "Indonesia" ? (
                  <Controller
                    name="province_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("city_id", "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {formatName(p.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input {...register("province_id")} />
                )}
              </div>
              <div>
                <Label>City</Label>
                {country === "Indonesia" ? (
                  <Controller
                    name="city_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {!provinceID ? (
                            <div className="px-3 py-2 text-sm text-gray-600">Select province first.</div>
                          ) : cities.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-600">Loading cities...</div>
                          ) : (
                            cities.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {formatName(c.name)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input {...register("city_id")} />
                )}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <Label>Short Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Enter short description (min 100 chars)"
                rows={15}
                maxLength={200}
              />
            </div>
          </form>

          <DialogFooter className="px-6 py-3 border-t bg-white">
            <div className="flex w-full justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="general-info-form"
                className="bg-teal-800 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
