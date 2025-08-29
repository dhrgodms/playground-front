import React, { useCallback, useRef, useState } from "react";
import {
    Button,
    Flex,
    FormControl,
    Input,
    Image,
    IconButton,
    useToast,
    Box,
    Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { serverUrlV2 } from "../Constants/Constants";

const ThumbnailUpload = ({ value, onChange, disabled = false }) => {
    const toast = useToast();
    const inputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    // presigned URL 요청
    const getPresignedUrl = async (fileName) => {
        const res = await axios.get(`${serverUrlV2}/s3/presigned-url`, {
            params: { fileName }
        });
        return res.data;
    };

    // presigned URL로 S3에 직접 업로드
    const uploadToS3 = async (presignedUrl, file) => {
        try {
            console.log('Uploading thumbnail to S3:', presignedUrl);
            console.log('File info:', file.name, file.type, file.size);

            const response = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!response.ok) {
                console.error('S3 upload failed:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
            }

            console.log('S3 upload successful');
        } catch (error) {
            console.error('S3 upload error:', error);
            throw error;
        }
    };

    const onUploadImage = useCallback(async (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        setIsUploading(true);

        try {
            // 파일명에서 띄어쓰기를 _로 치환
            const safeName = file.name ? file.name.replace(/\s+/g, '_') : 'thumbnail.png';
            const newFile = new File([file], safeName, { type: file.type });

            // presigned URL 요청
            const presignedUrl = await getPresignedUrl(safeName);

            // S3에 직접 업로드
            await uploadToS3(presignedUrl, newFile);

            // S3 URL 추출
            const s3Url = presignedUrl.split('?')[0];

            // 부모 컴포넌트에 URL 전달
            onChange(s3Url);

            toast({
                title: "썸네일이 업로드되었습니다",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            console.error("썸네일 업로드 실패:", error);
            toast({
                title: "썸네일 업로드에 실패했습니다",
                status: "error",
                isClosable: true,
            });
        } finally {
            setIsUploading(false);
            // input 초기화
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }, [onChange, toast]);

    const onUploadImageButtonClick = useCallback(() => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.click();
    }, []);

    const onDeleteImage = useCallback(() => {
        onChange("");
        toast({
            title: "썸네일이 제거되었습니다",
            status: "info",
            isClosable: true,
        });
    }, [onChange, toast]);

    return (
        <FormControl>
            <Flex gap={3} align="center">
                <Input
                    type="file"
                    onChange={onUploadImage}
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: "none" }}
                    disabled={disabled || isUploading}
                />
                <Button
                    size="sm"
                    onClick={onUploadImageButtonClick}
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    isLoading={isUploading}
                    loadingText="업로드 중..."
                    disabled={disabled || isUploading}
                >
                    썸네일
                </Button>

                {value && (
                    <IconButton
                        size="sm"
                        icon={<CloseIcon />}
                        onClick={onDeleteImage}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="썸네일 제거"
                        disabled={disabled || isUploading}
                    />
                )}
            </Flex>

            {value && (
                <Box mt={3}>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                        현재 썸네일:
                    </Text>
                    <Image
                        src={value}
                        alt="썸네일 미리보기"
                        maxH="100px"
                        objectFit="contain"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                    />
                </Box>
            )}
        </FormControl>
    );
};

export default ThumbnailUpload; 