local filter = require "@pkg/.pesde/jsdotlua_collections@1.2.7/collections/src/Array/filter"
local vide = require "@pkg/vide"
local text_input = require "@ui/styles/text-input"

export type InputFilter = (filter: string, old: string) -> string
export type Decoder<T> = (input: string, old_value: T) -> T?
export type Parser<T> = (value: T) -> string

export type DecodedInputProps<T> = {
	value: Reactive<T>,
	apply_value: (value: T) -> (),

	textbox_native: vide.vTextBox?,

	keep_on_focus: boolean?,
	ignore_nil: boolean?,
	apply_nil: boolean?,
	placeholder: string?,

	filters: Array<InputFilter>?,
	decoder: Decoder<T>?,
	parser: Parser<T>?,
}

local function DEFAULT_DECODER(input: string)
	return input :: any
end

local function DEFAULT_PARSER(value: any)
	return tostring(value)
end

local function decoded_input<T>(props: DecodedInputProps<T>)
	local textbox_ref = vide.source(nil :: any) :: Source<TextBox>
	local decoder = (props.decoder or DEFAULT_DECODER) :: Decoder<T>
	local parser = (props.parser or DEFAULT_PARSER) :: Parser<T>
	local filtering_text = false

	local parsed_value = vide.derive(function()
		return parser(props.value())
	end)

	local function on_focus_lost()
		local textbox = textbox_ref()
		local text = textbox.Text
		textbox.Text = ""
		local value = decoder(text, props.value())
		if value == nil and not props.apply_nil then
			return
		end

		props.apply_value(value :: any)
	end

	local function on_focused()
		local textbox = textbox_ref()
		if props.keep_on_focus then
			local value = props.value()
			if props.ignore_nil and value == nil then
				textbox.Text = ""
			else
				textbox.Text = parser(value)
				textbox.CursorPosition = textbox.Text:len() - 1
			end
		end
	end

	return text_input {
		props.textbox_native or {},
		{
			Text = "",
			Focused = on_focused,
			FocusLost = on_focus_lost,
			PlaceholderText = function()
				if parsed_value() == "" then
					return props.placeholder or ""
				else
					return parsed_value()
				end
			end,
			vide.action(textbox_ref),
		} :: vide.vTextBox,

		vide.changed("Text", function(text: string)
			if filtering_text then
				return
			end
			if not props.filters then
				return
			end

			local filtered_text = text
			for _, filter in props.filters do
				local next_filtered = filter(filtered_text, text)
				if type(next_filtered) == "string" then
					filtered_text = next_filtered
				end
			end

			filtering_text = true
			textbox_ref().Text = filtered_text
			filtering_text = false
		end),
	}
end

return decoded_input
