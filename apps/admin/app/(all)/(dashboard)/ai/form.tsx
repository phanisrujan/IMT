/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useForm } from "react-hook-form";
import { Button } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IFormattedInstanceConfiguration, TInstanceAIConfigurationKeys } from "@plane/types";
import { CustomSelect } from "@plane/ui";
// components
import { ControllerInput } from "@/components/common/controller-input";
// hooks
import { useInstance } from "@/hooks/store";

type IInstanceAIForm = {
  config: IFormattedInstanceConfiguration;
};

type AIFormValues = Record<TInstanceAIConfigurationKeys, string>;

type TLLMProvider = "openai" | "anthropic" | "gemini";

const LLM_PROVIDER_OPTIONS: Record<
  TLLMProvider,
  { label: string; modelDocURL: string; apiKeyURL: string; defaultModel: string }
> = {
  openai: {
    label: "ChatGPT / OpenAI",
    modelDocURL: "https://platform.openai.com/docs/models/overview",
    apiKeyURL: "https://platform.openai.com/api-keys",
    defaultModel: "gpt-4o-mini",
  },
  anthropic: {
    label: "Anthropic Claude",
    modelDocURL: "https://docs.anthropic.com/en/docs/about-claude/models",
    apiKeyURL: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-3-5-sonnet-20240620",
  },
  gemini: {
    label: "Google Gemini",
    modelDocURL: "https://ai.google.dev/gemini-api/docs/models",
    apiKeyURL: "https://aistudio.google.com/app/apikey",
    defaultModel: "gemini-1.5-pro-latest",
  },
};

export function InstanceAIForm(props: IInstanceAIForm) {
  const { config } = props;
  // store
  const { updateInstanceConfigurations } = useInstance();
  // form data
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AIFormValues>({
    defaultValues: {
      LLM_API_KEY: config["LLM_API_KEY"],
      LLM_PROVIDER: config["LLM_PROVIDER"] || "openai",
      LLM_MODEL: config["LLM_MODEL"],
    },
  });

  const providerKey = (watch("LLM_PROVIDER") || "openai") as TLLMProvider;
  const providerOption = LLM_PROVIDER_OPTIONS[providerKey] || LLM_PROVIDER_OPTIONS.openai;

  const handleProviderChange = (nextProvider: TLLMProvider) => {
    setValue("LLM_PROVIDER", nextProvider);
    setValue("LLM_MODEL", LLM_PROVIDER_OPTIONS[nextProvider].defaultModel);
  };

  const onSubmit = async (formData: AIFormValues) => {
    const payload: Partial<AIFormValues> = { ...formData };

    await updateInstanceConfigurations(payload)
      .then(() =>
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Success",
          message: "AI Settings updated successfully",
        })
      )
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <div className="pb-1 text-18 font-medium text-primary">AI provider</div>
          <div className="text-13 font-regular text-tertiary">
            Choose your model provider and configure the credentials once for all workspaces.
          </div>
        </div>
        <div className="grid-col grid w-full grid-cols-1 items-center justify-between gap-x-12 gap-y-8 lg:grid-cols-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-13 text-tertiary">Provider</h4>
            <CustomSelect
              value={providerKey}
              label={providerOption.label}
              onChange={(value: string) => handleProviderChange(value as TLLMProvider)}
              buttonClassName="rounded-md border-subtle"
              input
            >
              {Object.entries(LLM_PROVIDER_OPTIONS).map(([key, value]) => (
                <CustomSelect.Option key={key} value={key} className="w-full">
                  {value.label}
                </CustomSelect.Option>
              ))}
            </CustomSelect>
            <p className="pt-0.5 text-11 text-tertiary">Switch between OpenAI, Anthropic, and Gemini.</p>
          </div>

          <ControllerInput
            control={control}
            type="text"
            name="LLM_MODEL"
            label="LLM model"
            description={
              <>
                Choose a model from {providerOption.label}.{" "}
                <a href={providerOption.modelDocURL} target="_blank" className="text-accent-primary hover:underline" rel="noreferrer">
                  Learn more
                </a>
              </>
            }
            placeholder={providerOption.defaultModel}
            error={Boolean(errors.LLM_MODEL)}
            required={false}
          />

          <ControllerInput
            control={control}
            type="password"
            name="LLM_API_KEY"
            label="API key"
            description={
              <>
                Generate a key for {providerOption.label}.{" "}
                <a href={providerOption.apiKeyURL} target="_blank" className="text-accent-primary hover:underline" rel="noreferrer">
                  Open provider console
                </a>
              </>
            }
            placeholder="Paste API key"
            error={Boolean(errors.LLM_API_KEY)}
            required={false}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button variant="primary" size="lg" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {isSubmitting ? "Saving" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
