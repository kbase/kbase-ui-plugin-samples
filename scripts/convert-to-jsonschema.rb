require 'json'

fields = JSON.parse(File.read('sample-fields.json'))

# description:
# unit: in
# examples:
#   - 1.2
# display:
#   label: Boring Diameter
# sample:
#   key: boring_diameter_in


fields.each do |field|
  type = field['type']['type']

  schema = {
    "$schema" => "http://json-schema.org/draft-07/schema",
    "$id" => "http://kbase.us/schemas/samples/fields/sesar/#{field['id']}.json"
  }

  kbase = {}

  if field['label']
    schema['title'] = field['label']
  end

  ['description', 'examples'].each do |category|
    if field[category]
      schema[category] = field[category]
    end
  end

  case type
  when "string", "text"
    schema['type'] = 'string'
    if field['type']['constraints']['maxLength']
      schema['maxLength'] = field['type']['constraints']['maxLength']
    end
    if field['type']['constraints']['minLength']
      schema['minLength'] = field['type']['constraints']['minLength']
    end
  when "Enum<string>"
    schema['type'] = 'string'
    schema['enum'] = field['type']['constraints']['values']
  when "number"
    # puts field['type']['constraints']
    schema['type'] = 'number'
    if field['type']['constraints']['gte']
      schema['minimum'] = field['type']['constraints']['gte']
    end
    if field['type']['constraints']['lte']
      schema['maximum'] = field['type']['constraints']['lte']
    end
  when "OntologyTerm"
    schema['type'] = 'string'
    schema['format'] = 'ontologyTerm'
    schema['ancestorTerm'] = field['type']['constraints']['ancestorTerm'];
    schema['ontologyNamespace'] = field['type']['constraints']['ontologyNamespace'];
#     kbase['OntologyTerm'] = {
#       "ancestorTerm" => field['type']['constraints']['ancestorTerm'],
#       "ontologyNamespace" => field['type']['constraints']['ontologyNamespace']
#     }
  when "url"
    schema['type'] = 'number'
    schema['format'] = 'url'
  else
    puts "WARNING: unhandled type '#{type}'"
  end

  if field['units'] && field['units']['canonical'] != 'unit'
    if field['units']['available']
      kbase['units'] = {
        'available' => field['units']['available'],
        'canonical' => field['units']['canonical']
      }
    else
      kbase['units'] = {
        'available' => field['units']['available'],
        'canonical' => [field['units']['available']]
      }
    end
  end

  # Display configuration
  kbase['display'] = {}

  if field['label']
    kbase['display']['label'] = field['label']
  end

  if field['description']
    kbase['display']['tooltip'] = field['description']
  end

  if field['categories']
    kbase['categories'] = field['categories']
  end

  if field['type']['format']
    kbase['format'] = field['type']['format']
  end

  kbase['sample'] = {
   'key' => field['id'],
   'columnTitle' => field['label']
  }

  schema['kbase'] = kbase

#   filename = "out/#{field['id']}.json"

  # TODO: the field ids should be stricter - just lower alphanumeric and _.
  scrubbedId = field['id'].gsub(/[?:#$%^&*()-+=]/, '_')
  filename = "../react-app/public/schemas/fields/#{scrubbedId}.json"
  File.write(filename, JSON.pretty_generate(schema))

  # puts schema
end