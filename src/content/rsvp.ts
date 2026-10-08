export const meals = [
  { value: "chicken", label: "Chicken" },
  { value: "beef", label: "Beef" },
  { value: "vegetarian", label: "Vegetarian" },
];

export const mealLabel = (value: string | null) =>
  meals.find((meal) => meal.value === value)?.label ?? "";

export const rsvpCopy = {
  intro:
    "Type your first and last name as they appear on your invitation. We'll find your invitation so you can RSVP for everyone in your party.",
  thanksAttending: "Thank you! We can't wait to celebrate with you.",
  thanksDeclined: "Thank you for letting us know. We'll miss you!",
};
