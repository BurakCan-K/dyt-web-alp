"use client";

import { BmiCalculatorForm } from "@/components/calculators/BmiCalculatorForm";
import { EnergyCalculatorForm } from "@/components/calculators/EnergyCalculatorForm";
import { MacroCalculatorForm } from "@/components/calculators/MacroCalculatorForm";
import { PortionCalculatorForm } from "@/components/calculators/PortionCalculatorForm";
import { BlockedToolPanel } from "@/components/calculators/BlockedToolPanel";
import { CalcFormCard } from "@/components/calculators/field";
import {
  BodyCompForm,
  CarbCountForm,
  DriForm,
  FiberForm,
  FoodSearchForm,
  GlycemicForm,
  GlimForm,
  LabelForm,
  NrsForm,
  PlateForm,
  PregnancyForm,
  ProteinForm,
  RecipeNutritionForm,
  ReferenceWeightForm,
  SodiumForm,
  WaterForm,
  WeightChangeForm,
  WeightPlannerForm,
  WhrForm,
  WhtrForm,
} from "@/components/calculators/ExtraCalculatorForms";
import type { NutritionTool } from "@/lib/nutrition-tools/types";

function Wrap({ children }: { children: React.ReactNode }) {
  return <CalcFormCard>{children}</CalcFormCard>;
}

export function ToolFormRouter({ tool }: { tool: NutritionTool }) {
  if (tool.status === "Blocked") {
    return <BlockedToolPanel tool={tool} />;
  }

  switch (tool.slug) {
    case "vki":
      return <BmiCalculatorForm />;
    case "enerji":
      return <EnergyCalculatorForm />;
    case "makro":
      return <MacroCalculatorForm />;
    case "porsiyon":
      return <PortionCalculatorForm />;
    case "bel-boy-orani":
      return (
        <Wrap>
          <WhtrForm />
        </Wrap>
      );
    case "bel-kalca-orani":
      return (
        <Wrap>
          <WhrForm />
        </Wrap>
      );
    case "referans-agirlik":
      return (
        <Wrap>
          <ReferenceWeightForm />
        </Wrap>
      );
    case "agirlik-degisim":
      return (
        <Wrap>
          <WeightChangeForm />
        </Wrap>
      );
    case "vucut-kompozisyonu":
      return (
        <Wrap>
          <BodyCompForm />
        </Wrap>
      );
    case "hedef-kilo-planlayici":
      return (
        <Wrap>
          <WeightPlannerForm />
        </Wrap>
      );
    case "protein-ihtiyaci":
      return (
        <Wrap>
          <ProteinForm />
        </Wrap>
      );
    case "su-referansi":
      return (
        <Wrap>
          <WaterForm />
        </Wrap>
      );
    case "lif-referansi":
      return (
        <Wrap>
          <FiberForm />
        </Wrap>
      );
    case "dri-referans":
      return (
        <Wrap>
          <DriForm />
        </Wrap>
      );
    case "tarif-besin-degeri":
      return (
        <Wrap>
          <RecipeNutritionForm />
        </Wrap>
      );
    case "besin-arama":
      return (
        <Wrap>
          <FoodSearchForm />
        </Wrap>
      );
    case "besin-etiketi":
      return (
        <Wrap>
          <LabelForm />
        </Wrap>
      );
    case "karbonhidrat-sayimi":
      return (
        <Wrap>
          <CarbCountForm />
        </Wrap>
      );
    case "glisemik-yuk":
      return (
        <Wrap>
          <GlycemicForm />
        </Wrap>
      );
    case "sodyum-tuz":
      return (
        <Wrap>
          <SodiumForm />
        </Wrap>
      );
    case "tabak-planlama":
      return (
        <Wrap>
          <PlateForm />
        </Wrap>
      );
    case "gebelik-kilo":
      return (
        <Wrap>
          <PregnancyForm />
        </Wrap>
      );
    case "nrs-2002":
      return (
        <Wrap>
          <NrsForm />
        </Wrap>
      );
    case "glim":
      return (
        <Wrap>
          <GlimForm />
        </Wrap>
      );
    default:
      return <BlockedToolPanel tool={tool} />;
  }
}
