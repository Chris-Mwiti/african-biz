import { toast } from 'sonner';
import { COUNTRIES } from '../../lib/mockData';
import { CreateListingSchema, CreateListingDto } from '../../dto/listing.dto';
import { useCreateListing } from '../../services/listing.service';
import { useGetCategories } from '../../services/category.service';
import CloudinaryUploadWidget from '../../components/CloudinaryUploadWidget';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, X, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const STEPS = [
  { id: 1, name: 'Basic Info', description: 'Business name and description', fields: ['title', 'description'] },
  { id: 2, name: 'Contact', description: 'How customers can reach you', fields: ['address', 'country', 'city', 'phone', 'email', 'website'] },
  { id: 3, name: 'Media & Socials', description: 'Upload images and add social links', fields: ['images', 'social_links'] },
  { id: 4, name: 'Category', description: 'Categorize your business', fields: ['category_id'] },
  { id: 5, name: 'Confirm & Payment', description: 'Review and publish' },
];

export function CreateListing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: createListing, isPending } = useCreateListing();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();

  const form = useForm<CreateListingDto>({
    resolver: zodResolver(CreateListingSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      images: [],
      category_id: '',
      country: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      social_links: [],
      is_premium: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "social_links",
  });

  const { watch, setValue, trigger } = form;
  const formData = watch();

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else if (isValid && currentStep === STEPS.length) {
      console.log(formData)
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: CreateListingDto) => {
    createListing(data, {
      onSuccess: () => {
        toast.success('Listing created successfully! Pending approval.');
        navigate('/dashboard/listings');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create listing.');
      },
    });
  };

  const toggleCategory = (categoryId: string) => {
    const currentCategoryId = watch('category_id') || '';
    const newCategoryId = currentCategoryId === categoryId ? '' : categoryId;
    setValue('category_id', newCategoryId, { shouldValidate: true });
  };

  const handleCloudinaryUploadSuccess = (imageUrl: string) => {
    const currentImages = watch('images') || [];
    const newImages = [...currentImages, imageUrl];

    formData.images?.push(...newImages)
    setValue('images', newImages, { shouldValidate: true });
    toast.success('Image uploaded successfully!');
  };

  const removeImage = (index: number) => {
    const currentImages = watch('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('images', newImages, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="border-b bg-muted/30 px-6 py-8 -mx-6 -mt-6 mb-6">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="mb-2">Create New Listing</h1>
          <p className="text-muted-foreground">
            Follow the steps to create your business listing
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Step {currentStep} of {STEPS.length}</span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-6 grid gap-4 sm:grid-cols-5">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-lg border p-3 ${
                    step.id === currentStep
                      ? 'border-primary bg-primary/5'
                      : step.id < currentStep
                      ? 'border-accent bg-accent/5'
                      : 'border-muted'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {step.id < currentStep ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          step.id === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {step.id}
                      </div>
                    )}
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
              <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business, products, and services..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          {field.value?.length || 0} characters
                        </p>
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@business.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (optional)</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://yourbusiness.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Images</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Add photos of your business, products, or services
                        </p>
                        <FormControl>
                          <div className="grid gap-4 sm:grid-cols-3">
                            {watch('images')?.map((image, index) => (
                              <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                                <img src={image} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <CloudinaryUploadWidget
                              onUploadSuccess={handleCloudinaryUploadSuccess}
                              cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''}
                              uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''}
                              buttonText="Upload Image"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                  <Label>Social Links (optional)</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mt-2">
                      <FormField
                        control={form.control}
                        name={`social_links.${index}.platform` as const}
                        render={({ field }) => (
                           <FormItem>
                            <FormControl>
                              <Input placeholder="Platform (e.g., Facebook)" {...field} />
                             </FormControl>
                           </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`social_links.${index}.url` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="URL" {...field} />
                            </FormControl>
                           </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ platform: "", url: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Social Link
                  </Button>
                </div>
                </>
              )}

              {currentStep === 4 && (
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories *</FormLabel>
                      {isLoadingCategories && <p>Loading categories...</p>}
                      {isErrorCategories && <p className="text-red-500 text-sm">Error loading categories.</p>}
                      {categories && categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Badge
                              key={category.id}
                              variant={field.value === category.id ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => toggleCategory(category.id)}
                            >
                              {category.name}
                              {field.value === category.id && <X className="ml-1 h-3 w-3" />}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3">Listing Summary</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Business Name:</dt>
                        <dd className="font-medium">{watch('title')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category:</dt>
                        <dd className="font-medium">
                          {categories?.find(c => c.id === watch('category_id'))?.name || 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Location:</dt>
                        <dd className="font-medium">
                          {watch('city')}, {watch('country')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Images:</dt>
                        <dd className="font-medium">{watch('images')?.length || 0} uploaded</dd>
                      </div>
                       <div className="flex justify-between">
                        <dt className="text-muted-foreground">Socials:</dt>
                        <dd className="font-medium">{watch('social_links')?.length || 0} added</dd>
                      </div>
                    </dl>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_premium"
                    render={({ field }) => (
                      <FormItem className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <FormLabel>Upgrade to Premium?</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Get featured on home page and unlock events & blogs
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </div>
                        {field.value && (
                          <div className="mt-4 rounded-lg border bg-background p-3">
                            <p className="mb-2 font-medium">Premium Benefits:</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>• Featured on home page carousel</li>
                              <li>• Priority search ranking</li>
                              <li>• Post unlimited events and blogs</li>
                              <li>• Advanced analytics</li>
                            </ul>
                            <p className="mt-3 font-medium">Price: $29/month</p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type={currentStep === STEPS.length ? 'submit' : 'button'}
              onClick={handleNext}
              disabled={isPending}
            >
              {currentStep === STEPS.length ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isPending ? 'Submitting...' : 'Submit Listing'}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
